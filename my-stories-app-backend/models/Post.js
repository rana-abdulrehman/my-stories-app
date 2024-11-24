const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  status: { type: String, enum: ['pending', 'approved', 'disapproved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
// author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },