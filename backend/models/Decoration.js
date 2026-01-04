import mongoose from 'mongoose';

const decorationSchema = new mongoose.Schema({
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
    enum: ['فردي', 'شركة', 'استوديو']
  },
specialty: {
  type: String,
  required: true,
  enum: ['ديكور أفراح', 'ديكور صالات', 'تصميم داخلي', 'ديكور خارجي', 'إضاءة وأضواء', 'تنسيق زهور']
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
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  portfolio: [{
    type: String,
    required: true
  }],
  profileImage: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    enum: ['تصميم ديكور', 'تنسيق زهور', 'إضاءة وديكور ضوئي', 'تصميم أركان', 'ديكور خشبي', 'ستائر وديكور نسيجي', 'تصميم مداخل']
  }],
  materials: [{
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
  decorationSpecific: {
    designTime: { type: Number, default: 0 }, // أيام التصميم
    executionTime: { type: Number, default: 0 }, // أيام التنفيذ
    teamSize: { type: Number, default: 1 },
    providesMaterials: { type: Boolean, default: false },
    setupIncluded: { type: Boolean, default: false },
    cleanupIncluded: { type: Boolean, default: false }
  },
  styles: [{
    type: String,
    enum: ['كلاسيكي', 'حديث', 'عصري', 'تراثي', 'فاخر', 'بوهو', 'طبيعي', 'ملون']
  }],
  packages: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    includes: [{ type: String }],
    designTime: { type: Number },
    executionTime: { type: Number }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Decoration', decorationSchema);