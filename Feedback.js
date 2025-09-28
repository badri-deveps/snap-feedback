const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  shareId: { type: String }, // optional shareable link token
  resolved: { type: Boolean, default: false },
  ip: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
