const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map((note) => note.toJSON()))
})

blogRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (request.token === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(request.user)
  console.log(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  if (request.token === null) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const postAuthor = await Blog.findById(request.params.id)
  console.log('token peron ' + request.user.id)
  // console.log('author person ' + postAuthor.user)
  // console.log(request.user.id == postAuthor.user)
  if (postAuthor === null)
    response.status(400).json({ error: 'Post does not exist' })
  const result =
    request.user.id == postAuthor.user
      ? await Blog.findByIdAndRemove(request.params.id)
      : response.status(401).json({ error: 'unauthorised user' })
  response.status(201).send(result)
})

blogRouter.put('/:id', async (request, response) => {
  const result = await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(201).send(result)
})

module.exports = blogRouter
