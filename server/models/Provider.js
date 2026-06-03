const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  photo: { type: String },
  category: { type: String, required: true },
  services: [String],
  priceRange: { type: String },
  experience: { type: String },
  city: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
  address: { type: String },
  description: { type: String },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  reviews: [{
    customerName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  totalViews: { type: Number, default: 0 },
  totalCalls: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
