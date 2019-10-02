var _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

// Test returns the sum of all likes
const totalLikes = (blogs) => {
  let likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return likes
}

// Test returns most liked blog
const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const mostLikes = Math.max(...likes)
  const favorite = blogs.find( ({ likes }) =>  likes === mostLikes)
  return favorite
}

// Test returns most prolific author and number of blogs
const mostBlogs = (blogs) => {
  const blogSums =
    _.countBy(blogs, 'author')
  const maxValue =
    _.max(_.values(blogSums))
  const maxAuthor =
    _.max(_.keys(blogSums))
  const arr = { 'author': maxAuthor, 'blogs': maxValue }
  return arr
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}