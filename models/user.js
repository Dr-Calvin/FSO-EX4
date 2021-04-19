const mongoose = require('mongoose')
const uq = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minLength: 3 },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.plugin(uq)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject.__v
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
