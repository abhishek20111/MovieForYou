const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  movieId: [{
    public: { type: Boolean, default: false },
    id: { type: String }
  }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
