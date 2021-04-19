const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  request.token =
    request.headers.authorization === undefined
      ? null
      : request.headers.authorization.split(' ')[1]

  next()
}
const userExtractor = (request, response, next) => {
  const decodedToken =
    request.token === null
      ? null
      : jwt.verify(request.token, process.env.SECRET)
  // const usersInfo = await User.findById(decodedToken.id)
  // console.log(request.token)
  // console.log(decodedToken)

  request.user = request.token === null ? null : decodedToken

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
