const { Schema, model } = require('mongoose')

const dogSchema = new Schema({
  name: String,
  age: Number
})

module.exports = model('Dog', dogSchema)