const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get rid of favicon error
blogsRouter.get('/favicon.ico', (req, res) => res.status(204))

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  await Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

// Post new blog, default 0 for likes
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })
  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter