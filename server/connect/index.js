const router = require('express').Router()
const User = require('../db/models/user')
module.exports = router

// *==========================================
// *** AUTHORIZE:  already connected to another account, just linking to existing user account
// *==========================================

// *** GET   ('connect/local/')
// router.get('/local', async (req, res, next) => {
//   try {

//   } catch (err) {
//     next(err)
//   }
// })
// *** POST  ('/connect/local')
// router.post('/local', async (req, res, next) => {
//   try {
//     const user = await User.findOne({where: {email: req.body.email}})
//     if (!user) {
//       console.log('No such user found:', req.body.email)
//       res.status(401).send('Wrong username and/or password')
//     } else if (!user.correctPassword(req.body.password)) {
//       console.log('Incorrect password for user:', req.body.email)
//       res.status(401).send('Wrong username and/or password')
//     } else {
//       req.login(user, err => (err ? next(err) : res.json(user)))
//     }
//   } catch (err) {
//     next(err)
//   }
// })

// router.post('/logout', (req, res) => {
//   req.logout()
//   req.session.destroy()
//   res.redirect('/')
// })

// router.get('/me', (req, res) => {
//   res.json(req.user)
// })

// *===========================================
// *** ROUTES      '/CONNECT/--service--/'
// *===========================================
// router.use('/google', require('./google'))
router.use('/fitbit', require('./fitbit'))
