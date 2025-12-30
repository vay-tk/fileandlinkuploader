const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  imageURL: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid URL
        if (!v) return true;
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  imagePath: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for image URL (prefer imageURL over imagePath)
productSchema.virtual('displayImage').get(function() {
  if (this.imageURL) {
    return this.imageURL;
  } else if (this.imagePath) {
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${this.imagePath}`;
  }
  return null;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Product', productSchema);