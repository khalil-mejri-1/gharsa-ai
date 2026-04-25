import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional because of Google Auth
  role: { type: String, enum: ['farmer', 'expert'], default: 'farmer' },
  profilePicture: { type: String, default: '' },
  googleId: { type: String },
  agreedToTerms: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
