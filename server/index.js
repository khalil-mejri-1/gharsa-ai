import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AgriSmart AI API is running' });
});

import User from './models/User.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';

// Set up Multer for profile picture uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ImgBB is used for storage now.

// Auth Routes
app.post('/api/auth/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    let hashedPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    let profilePictureUrl = '';
    if (req.file) {
      try {
        const base64Image = req.file.buffer.toString('base64');
        const formData = new URLSearchParams();
        formData.append('image', base64Image);

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=121b6ba04d3eb2689b739ef4861dc94e`, {
          method: 'POST',
          body: formData,
        });
        const imgbbData = await imgbbRes.json();
        if (imgbbData.success) {
          profilePictureUrl = imgbbData.data.url;
        } else {
          console.error('ImgBB API Error:', imgbbData);
        }
      } catch (err) {
        console.error('Error uploading to ImgBB:', err);
      }
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'farmer',
      profilePicture: profilePictureUrl
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'mock_jwt_token_123', user: { name: req.body.email, role: 'user' } });
});

// Data routes (Mock)
app.post('/api/ai/analyze', (req, res) => {
  res.json({ disease: 'Late Blight', confidence: 94.5 });
});


// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agrismart')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error('MongoDB connection error:', error));