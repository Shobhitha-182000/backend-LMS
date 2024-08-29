// enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseName: { type: String, required: true },
   
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
