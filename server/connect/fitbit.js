const router = require('express').Router()
const passport = require('passport')
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy

const {User} = require('../db/models/user')
// const {isLoggedIn, isLegit} = require('../api/utils/routeProtect')
module.exports = router

if (!process.env.FITBIT_CLIENT_ID || !process.env.FITBIT_CLIENT_SECRET) {
  console.log('Fitbit client ID / secret not found. Skipping Fitbit OAuth.')
} else {
  // *** Fitbit credentials
  const fitbitCreds = {
    clientID: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    callbackURL: process.env.FITBIT_CALLBACK_URL,
    passReqToCallback: true //^ <== different if you CONNECT versus Authenticate
  }

  // *** Fitbit will send back the token & profile
  const verificationCallback = async (
    req,
    token,
    refreshToken,
    profile,
    done
  ) => {
    console.log(
      '---',
      'PROFILE in verification CONNECT callback',
      profile,
      '---'
    )
    try {
      const userInfo = {
        fitbitId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        fitbitAccessToken: token,
        fitbitRefreshToken: refreshToken
      }

      //^ check if the user is already logged in
      if (!req.user) {
        //#region
        // // *** findOrCreate method returns array, thus destructuring...
        // const [user] = await User.findOne({
        //   where: {fitbitId: profile.id},
        // //   defaults: userInfo
        // }, async function(error, user) {
        //     // if there is an error, stop everything and return that
        //     // ie an error connecting to the database
        //     if (error) return done(error)
        //     if (user) return done(null, user) // *** user is piped through passport.serializeUser
        //     else {
        //         const newUser = await User.create(userInfo)
        //         return done(null, newUser)
        //     }
        // })
        //#endregion
        // *** findOrCreate method returns array, thus destructuring...
        const [user] = await User.findOrCreate({
          where: {fitbitId: profile.id},
          defaults: userInfo
        })

        done(null, user) // *** user is piped through passport.serializeUser
      } else {
        //^ user already exists & is logged in => link accounts
        let currentUser = req.user //^ <== pull user out of the session
        // let [user] = await User.findByPk(req.user.id)
        // const [numberOfAffectedRows, affectedRows] = await User.update({userInfo}, {
        //     where: {id: req.user.id},
        //     returning: true, // needed for affectedRows to be populated
        //     plain: true // makes sure that the returned instances are just plain objects
        // })

        // TODO: What about session?? Does this update?
        currentUser = await currentUser.update({...currentUser, ...userInfo})
        console.log('Current User: ', currentUser)
        // user = {...user, ...userInfo}

        // *** SAVE the user (in DB)
        // currentUser = await currentUser.save()
        // console.log("AffectedRow User: ", affectedRows[0])
        done(null, currentUser) // *** user is piped through passport.serializeUser
        // done(null, affectedRows[0])

        //#region    Alt version?
        // // save the user
        // currentUser.save(function(err) {
        //     if (err) throw err
        //     return done(null, currentUser)
        // })
        //#endregion
      }
    } catch (error) {
      done(error)
    }
  }

  const strategy = new FitbitStrategy(fitbitCreds, verificationCallback)

  passport.use(strategy)

  // passport.use('fitbit-authz', strategy)

  // *** GET   ('/connect/fitbit/')
  // *** USER PETITION for Fitbit authentication & login (GET /auth/fitbit)
  router.get(
    '/:userId',
    passport.authorize('fitbit-authz', {
      scope: [
        'sleep',
        'weight',
        'activity',
        'heartrate',
        'nutrition',
        'profile'
      ]
    })
  )

  // *** CALLBACK for user, redirected from Fitbit (GET /connect/fitbit/verify)
  router.get(
    '/verify',
    passport.authorize('fitbit-authz', {
      // TODO: Redirect to dashboard with modal/popover displaying success/failure
      // TODO: Dashboard should show list of connected apps [Fitbit, MyFitnessPal, etc]
      successRedirect: '/dash/fitbit/success',
      // failureRedirect: '/dash/fitbit/failure',
      failureRedirect: '/login'
    })
  )
}
