const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

// Get rid of favicon error
commentRouter.get('/favicon.ico', (req, res) => res.status(204))

// Get all comments
commentRouter.get('/', async (request, response) => {
  const comments = await Comment
    .find({})
    .populate('blog', { id: 1 })
  response.json(comments.map(comment => comment.toJSON()))
})

// Add comment
commentRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const newComment = new Comment({
      content: body.content,
      blog: body.blog
    })

    const blog = await Blog.findById(body.blog)
    const savedComment = await newComment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()
    response.json(savedComment.toJSON())
  } catch(exception) {
    next(exception)
  }
})

module.exports = commentRouter