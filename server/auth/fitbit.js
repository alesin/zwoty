const passport = require('passport')
const router = require('express').Router()
const FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy
const {User} = require('../db/models')
const isLoggedIn = require('../api/utils/routeProtect')
module.exports = router

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables.
 */

if (!process.env.FITBIT_CLIENT_ID || !process.env.FITBIT_CLIENT_SECRET) {
  console.log('Fitbit client ID / secret not found. Skipping Fitbit OAuth.')
} else {
  // *** Fitbit credentials
  const fitbitCreds = {
    clientID: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
    callbackURL: process.env.FITBIT_CALLBACK_URL
  }

  // *** Fitbit will send back the token & profile
  const verificationCallback = async (token, refreshToken, profile, done) => {
    console.log('---', 'PROFILE in verification callback', profile, '---')

    const userInfo = {
      fitbitId: profile.id,
      // fullName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      fitbitAccessToken: token,
      fitbitRefreshToken: refreshToken
    }

    try {
      // *** findOrCreate method returns array, thus destructuring...
      const [user] = await User.findOrCreate({
        where: {fitbitId: profile.id},
        defaults: userInfo
      })

      done(null, user) // *** user is piped through passport.serializeUser
    } catch (error) {
      done(error)
    }
  }

  // *** configuring the STRATEGY  (credentials + verification callback)
  // ^ this is used by 'passport.authenticate'
  const strategy = new FitbitStrategy(fitbitCreds, verificationCallback)

  passport.use(strategy)

  // *** USER PETITION for Fitbit authentication & login (GET /auth/fitbit)
  router.get(
    '/',
    passport.authenticate('fitbit', {
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

  // *** CALLBACK for user, redirected from Fitbit (GET /auth/fitbit/verify)
  router.get(
    '/verify',
    passport.authenticate('fitbit', {
      // TODO: Redirect to dashboard with modal/popover displaying success/failure
      // TODO: Dashboard should show list of connected apps [Fitbit, MyFitnessPal, etc]
      successRedirect: '/dash/fitbit/success',
      // failureRedirect: '/dash/fitbit/failure',
      failureRedirect: '/login'
    })
  )
}

// TODO: API routes to grab data
// TODO: Protect routes!!!

router.get('/success/:userId', isLoggedIn, async (req, res, next) => {
  try {
    const theUser = await User.findOne({
      where: {
        id: req.user.id
      },
      attributes: ['firstName', 'fitbitId', 'fitbitAccessToken']
    })
    console.log('Success connecting Fitbit API in auth!')
    res.json(theUser)
  } catch (error) {
    next(error)
  }
})
