import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const photographerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['فردي', 'استوديو', 'شركة تصوير']
  },
  specialty: {
    type: String,
    required: true,
    enum: ['تصوير أفراح', 'تصوير طبيعي', 'تصوير فني', 'تصوير تقليدي', 'تصوير حديث']
  },
  experience: {
    type: Number,
    required: true,
    min: 1
  },
  governorate: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  portfolio: [portfolioItemSchema],
  profileImage: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    enum: ['تصوير قبل الزفاف', 'تصوير حفل الزفاف', 'تصوير ما بعد الحفل', 'ألبوم كامل', 'فيديو', 'درون']
  }],
  equipment: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  socialMedia: {
    instagram: String,
    facebook: String,
    website: String
  },
  photographySpecific: {
    hoursCoverage: { type: Number, default: 0 },
    numberOfPhotos: { type: Number, default: 0 },
    digitalPhotos: { type: Boolean, default: true },
    printedPhotos: { type: Boolean, default: false },
    photoAlbum: { type: Boolean, default: false },
    videoCoverage: { type: Boolean, default: false },
    secondPhotographer: { type: Boolean, default: false },
    editingTime: { type: Number, default: 0 },
    rawFiles: { type: Boolean, default: false }
  },
  packages: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    hours: { type: Number },
    photosCount: { type: Number }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Photographer', photographerSchema);