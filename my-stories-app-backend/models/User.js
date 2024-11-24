const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

userSchema.methods.comparePassword = function (password) {
  return this.password === password;
};

const User = mongoose.model('User', userSchema);

module.exports = User;