const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Get all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(u => u.toJSON()))
})

// Get one user
usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User
      .findById(request.params.id)
      .populate('blogs')
    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

// Add a new user
usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.password.length < 3) {
      return response.status(400).json({ error: 'too short password' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter