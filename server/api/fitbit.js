const router = require('express').Router()
const {User} = require('../db/models')
const axios = require('axios')
const isLoggedIn = require('../api/utils/routeProtect')

router.get('/:userId', isLoggedIn, async (req, res, next) => {
  try {
    // const theUser = await User.findByPk(req.params.userId, {
    //     attributes: ['id']
    // })
    const theUser = await User.findOne({
      where: {
        userId: req.params.userId
      },
      // ^^ explicitly select only the id and fitbitId fields - even though users' passwords are encrypted, it won't help if we just send everything to anyone who asks!
      attributes: ['id', 'fitbitId']
    })
    res.json(theUser)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/profile', isLoggedIn, async (req, res, next) => {
  try {
    // const theUser = await User.findByPk(req.params.userId, {
    //     attributes: ['id']
    // })
    let url = User.buildURL('-', 'profile.json')
    const theUser = await User.findOne({
      where: {
        // userId: req.params.userId
        id: req.params.userId
      },
      attributes: ['id', 'fitbitId']
    })

    // let url = theUser.buildURL('-', 'profile.json')
    let userProfile = await theUser.userRequest(url)

    res.json(userProfile)
  } catch (error) {
    next(error)
  }
})

module.exports = router
