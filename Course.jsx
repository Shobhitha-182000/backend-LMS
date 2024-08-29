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
    type: Number,
    min: 0,
    max: 5
  },
  userId: { 
    type: String, 
    required: true 
  },
  courseId: {
    type: String, 
    required: true 
  },
  videoUrl: {
    type: String
  },
  description: {
    type: String
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
