const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  imagePath: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  rating: {
    type: String, // Store rating as a string (e.g., '4.5/5')
    required: true
  },
 
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User model
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
