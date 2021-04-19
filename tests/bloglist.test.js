const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there is a new flavor idea', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map((el) => el.id)
  console.log(contents)
  expect(response.body[0].id).toBeDefined()
})

test('new post', async () => {
  const newBlog = {
    title: 'Tim Cook',
    author: 'apple',
    url: 'http://google.com',
    likes: 0,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map((r) => r.title)
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain('Tim Cook')
})
test('default likes = 0', async () => {
  const newBlog = {
    title: 'Tom Jones',
    author: 'rasputin',
    url: 'http://google.com',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map((r) => r.likes)
  console.log(contents)
  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents[contents.length - 1]).toEqual(0)
})

test('requiredFields', async () => {
  const newBlog = {
    author: 'rasputin',
    likes: 200,
  }
  await api.post('/api/blogs').send(newBlog).expect(400)

  // const response = await api.get('/api/blogs')
  // const contents = response.body.map((r) => r)
  // console.log(contents)
  // expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  // expect(contents[contents.length - 1]).toEqual(0)
})

afterAll(() => {
  mongoose.connection.close()
})
