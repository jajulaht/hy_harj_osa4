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

// Post new blog, default 0 for likes
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  if (blog.likes === undefined) {
    blog.likes = 0
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter