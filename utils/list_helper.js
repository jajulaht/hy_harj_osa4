var _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
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
    _(blogs)
      .countBy('author')
      .map((objs, key) => ({
        'author': key,
        'blogs': _(objs).value()
      }))
      .value()
  const maxBlogs = _.maxBy(blogSums, 'author')
  //   _.countBy(blogs, 'author')
  // const maxValue =
  //   _.max(_.values(blogSums))
  // const maxAuthor =
  //   _.max(_.keys(blogSums))
  // const arr = { 'author': maxAuthor, 'blogs': maxValue }
  // console.log(blogSums)
  return maxBlogs
}

// Test returns author with most likes
const mostLikes = (blogs) => {
  const auth =
    _(blogs)
      .groupBy('author')
      .map((objs, key) => ({
        'author': key,
        'likes': _.sumBy(objs, 'likes')
      }))
      .value()
  const maxLikes = _.maxBy(auth, 'likes')
  // console.log('Tulos', maxLikes)
  return maxLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}