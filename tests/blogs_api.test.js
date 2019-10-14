const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
mongoose.set('useFindAndModify', false)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

// Tests for getting data from db
describe('when there is initially some blog posts saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(3)
  })

  test('ids are defined', async () => {
    const response = await api.get('/api/blogs')
    const coll = response.body
    for (const blog of coll) {
      expect(blog.id).toBeDefined()
    }
  })
})

// Tests for post, update etc.
describe('tests for posting data to db', () => {
  // Test of adding a blog to db
  test('a valid blog info can be added', async () => {
    const newBlog = {
      title: 'First class tests, version 2.0',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain(
      'First class tests, version 2.0'
    )
  })

  // Test for default value of 0 for likes
  test('default 0 for likes', async () => {
    const newBlog = {
      title: 'First class tests, version 3.0',
      author: 'Robert Murdoch',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const theBlog = response.body.find( ({ author }) => author === 'Robert Murdoch' )

    expect(response.body.length).toBe(initialBlogs.length + 2)
    expect(theBlog.likes).toBe(0)
  })

  // Test for required fields
  test('title and url must be added to fields, if not --> error', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

// Tests for deleting from db
describe('tests for deleting', () => {
  // Test for deleting blog post
  test('a specific blog info can be deleted', async () => {
    const response = await api.get('/api/blogs')
    const blogsAtStart = response.body
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const response2 = await api.get('/api/blogs')
    const titles = response2.body.map(r => r.title)

    expect(response2.body.length).toBe(initialBlogs.length + 1)
    expect(titles).not.toContain(
      'React patterns'
    )
  })
})

describe('tests for updating', () => {
  // Test for updating likes
  test('likes of a specific blog info can be updated', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogToUpdate = blogs[1]
    const updatedLikes =
    {
      id: blogToUpdate.id,
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 6
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)

    const response2 = await api.get('/api/blogs')
    const blogs2 = response2.body
    expect(blogs2[1].likes).toBe(6)
  })
})

// Tests for user
describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('no users with passwords under 3 chars are created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'shortpass',
      name: 'Seppo Säpikäs',
      password: 'no',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('too short password')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('no usernames under 3 chars are created', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'pp',
      name: 'Pirkka Pekka Petelius',
      password: 'herra47',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('pp')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})