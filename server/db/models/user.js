const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const axios = require('axios')
const qs = require('qs')
const moment = require('moment-timezone')

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true
    // allowNull: false
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  imgUrl: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a function hides it when serializing to JSON. HACK for Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON. HACK for Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  fitbitId: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('fitbitId')
    }
  },
  fitbitAccessToken: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('fitbitAccessToken')
    },
    set(value) {
      this.setDataValue('fitbitAccessToken', value)
    }
  },
  fitbitRefreshToken: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('fitbitRefreshToken')
    },
    set(value) {
      this.setDataValue('fitbitRefreshToken', value)
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    default: false
  }
})

/**
 //* instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

/**
 //* classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}
User.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 //* hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})

// ***   Fitbit Methods    ***
// * INSTANCE Methods
User.prototype.getAccessToken = function() {
  return this.fitbitAccessToken()
}
User.prototype.fitbitConnected = async function() {
  return !!await this.getAccessToken()
}
User.prototype.getProfileId = function() {
  return this.fitbitId()
  //TODO: Upgrade for security?
  // return cache('encodedId', async () => {
  //   return (await this.getProfile()).encodedId;
  // })
  // ^^ Would require import...
  // const { cache } = require('./cache')
}
// ?? Should we store the entire profile Object?
// TODO: Find how profile data is returned from Fitbit\
//#region
User.prototype.getProfile = async function() {
  // const profiles = await cms.resource('profiles').findAll({ limit: 1 });
  // return profiles[0];
}
User.prototype.getTimezone = function() {
  //   return cache('timezone', async () => {
  //     return (await this.getProfile()).timezone
  //   })
}
User.prototype.now = async function() {
  //TODO: consider Webpack modifications because of moment-timezone size
  //! https://momentjs.com/timezone/docs/
  // const tz = await this.getTimezone();
  // return moment().tz(tz);
}
//#endregion

User.prototype.userRequest = async function(url) {
  const headers = {
    Authorization: `Bearer ${await this.getAccessToken()}`
  }
  return this.getRequest({url, headers})
}
User.prototype.getRequest = async function(options, retry = true) {
  try {
    return await axios.get(`${options.url}`, {headers: options.headers})
  } catch (error) {
    // TODO: REFACTOR... fix 2nd request?? confirm AccessToken updated
    if (error.response.status === 401 && retry) {
      await this.refreshToken()
      return this.getRequest(options, false)
    }
    throw error
  }
}
// ? CONFIRM that instance method calls work
User.prototype.refreshToken = async function() {
  try {
    const url = 'https://api.fitbit.com/oauth2/token'

    if (this.refreshed) {
      return this.refreshed
    }

    this.refreshed = await axios.post(
      `${url}`,
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.fitbitRefreshToken(),
        expires_in: '31536000'
      }),
      {
        headers: {
          // 'authorization': `Basic ${this.basicAuthToken}`,
          authorization: `Basic ${this.basicAuthToken()}`,
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    )
    let {access_token, refresh_token} = this.refreshed.data
    // this.fitbitAccessToken = access_token
    // this.fitbitRefreshToken = refresh_token
    this.fitbitAccessToken = `${access_token}`
    // this.fitbitRefreshToken = String(refresh_token)
    this.fitbitRefreshToken = `${refresh_token}`
    await this.save()

    this.refreshed = null
  } catch (error) {
    this.refreshed = null
    console.log('Whoops, there was an error refreshing your token!', error)
  }
}
User.prototype.revokeAccess = async function() {
  try {
    const url = 'https://api.fitbit.com/oauth2/revoke'

    if (this.revoked) {
      return this.revoked
    }

    this.revoked = await axios.post(
      `${url}`,
      qs.stringify({
        token: this.fitbitAccessToken()
      }),
      {
        headers: {
          Authorization: `Basic ${this.basicAuthToken()}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    let {data} = this.revoked
    console.log('Access Revoked!', data)
    //TODO: reset token data in DB!
    this.fitbitAccessToken = null
    this.fitbitRefreshToken = null
    await this.save()

    this.revoked = null
  } catch (error) {
    this.revoked = null
    console.log('Whoops, there was an error revoking your access!', error)
  }
}
//TODO: fetch data methods
User.prototype.fetchSummary = async function() {
  const fitbitConnected = await this.fitbitConnected()
  if (!fitbitConnected) {
    return null
  }
}
//#region  GET a summary of health data  (Modify & Reuse old code)
// async fetchSummary() {
//   const initialized = await this.initialized();
//   if (!initialized) {
//     return null;
//   }

//   const now       = await this.now();
//   const date      = now.format('YYYY-MM-DD');
//   const url       = await this.buildUrl(`activities/date/${date}.json`);

//   const { data }    = await this.userRequest(url);
//   const { summary } = data;

//   const tasks = _.compact([
//     ..._.map(summary.distances, (d) => saveDistance(d)),
//     ..._.map(summary, (val, key) => _.isNumber(val) ? savePair(key, val).to('stats') : null)
//   ]);

//   return await Promise.all(tasks);
// }
//#endregion

/**
 //* classMethods
 */
User.basicAuthToken = function() {
  return Buffer.from(
    `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`
  ).toString('base64')
}
// ??: confirm working! use of instance method in class method
User.buildURL = function(fitbitId, endpoint) {
  //! FITBIT Docs:
  //! To make a request to the Fitbit API using OAuth 2.0, simply add an Authorization header to the HTTPS request with the user's access token.
  //^ EXAMPLE:  GET https://api.fitbit.com/1/user/-/profile.json
  //? Does that mean... no need for querying the DB?
  //? const fitbitId = '-'
  // const fitbitId = this.getProfileId()
  return `https://api.fitbit.com/1/user/${fitbitId}/${endpoint}`
}

module.exports = User
