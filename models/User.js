import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  photo: { type: String, required: true }, // URL or base64 string
  files: [{ type: String }], // Array of file URLs or names
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
