const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

const image = mongoose.model('image', signupSchema);

module.exports = image;
