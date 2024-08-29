const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const os = require('os');

// Import models
const signup = require('./signup'); 
const image = require('./image');
const Course=require('./Course.jsx')
const Enrollment = require('./enrollment');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://root:root@cluster0.ftu4trq.mongodb.net/LAM?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });

const networkInterfaces = os.networkInterfaces();
const localIP = networkInterfaces['en0'] ? networkInterfaces['en0'][1].address : '127.0.0.1';

// User signup endpoint
app.post("/studysignups", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should have a minimum of 6 characters.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one uppercase letter.' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one lowercase letter.' });
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one special character.' });
  }

  try {
    const sp = await signup.create({ username, email, password });
    res.status(201).json(sp);
  } catch (err) {
    console.error('Error creating signup:', err); 
    res.status(400).json({ message: 'Error creating signup', error: err.message });
  }
});

// User login endpoint
app.post("/studylogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await signup.findOne({ email, password });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

app.get('/studylogin/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log('Received userId:', userId); // Log the received userId

  try {
    // Assuming `signup` is your Mongoose model
    const user = await signup.findOne({ _id: userId }); 

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'No user found with the provided ID' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error while fetching user details', error: err.message });
  }
});


// Profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/profileimage", upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!userId || !imagePath) {
      return res.status(400).json({ message: 'UserId and imagePath are required' });
    }

    const newImage = await image.create({ userId, imagePath });
    res.status(201).json(newImage);
  } catch (err) {
    console.error('Error creating image:', err.message);
    res.status(500).json({ message: 'Error creating image', error: err.message });
  }
});

// Course image management
app.post("/courseimg", async (req, res) => {
  try {
    const sp = await courseimg.create(req.body);
    res.status(201).json(sp);
  } catch (err) {
    console.error('Error in course image:', err); 
    res.status(400).json({ message: 'Error in fetching course image', error: err.message });
  }
});

app.get("/courseimgs", async (req, res) => {
  try {
    const sp = await courseimg.find();
    res.status(200).json(sp);
  } catch (err) {
    console.error('Error fetching course images:', err); 
    res.status(400).json({ message: 'Error fetching course images', error: err.message });
  }
});

// Enrollment endpoints
app.post('/enroll', async (req, res) => {
  const { email, courseId } = req.body;

  if (!email || !courseId) {
    return res.status(400).json({ message: 'Email and Course ID are required.' });
  }

  try {
    const enrollment = await Enrollment.create({ email, courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    console.error('Error creating enrollment:', err);
    res.status(400).json({ message: 'Error creating enrollment', error: err.message });
  }
});

app.post('/enrollCourse/:userId', async (req, res) => {
  const { userId } = req.params;
  const { courseId, courseName, imagePath, rating,videoUrl,description} = req.body;

  try {
    const user = await signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingCourse = await Course.findOne({ userId, courseId });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already enrolled' });
    }
 
    const newCourse = new Course({
      userId,
      courseId,
      courseName,
      imagePath,
      rating,
      videoUrl,
      description
    });

    await newCourse.save();

    res.status(200).json({ message: 'Course enrolled successfully', course: newCourse });
  } catch (error) {
    console.error('Error enrolling course:', error);
    res.status(500).json({ message: 'Server error while enrolling course', error: error.message });
  }
});

 
app.get('/enrollCourse/:userId', async (req, res) => {
  const { userId } = req.params;

  console.log('====================================');
  console.log('Fetching courses for user:', userId);
  console.log('====================================');

  try {
    // Adjust the query according to your schema. Assuming you want to find courses by userId.
    const courses = await Course.find({ userId: userId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this user' });
    }

    res.status(200).json({ message: 'Courses retrieved successfully', courses: courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error while fetching courses', error: error.message });
  }
});



const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server started on http://${localIP}:${PORT}`);
});
// app.listen(5000,()=>{
//   console.log('5000 port is running')
// })
