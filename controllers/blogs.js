const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get rid of favicon error
blogsRouter.get('/favicon.ico', (req, res) => res.status(204))

// Get all blogs
blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

// Post new blog
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter