const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users.map((u) => u.toJSON()))
})

userRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash =
    body.password.length > 2
      ? await bcrypt.hash(body.password, saltRounds)
      : false
  if (!passwordHash) {
    response
      .status(400)
      .json({ error: 'Password does not meet 3 character minimum requirement' })
  }
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = userRouter
