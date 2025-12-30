import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['link', 'file'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  mimeType: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Submission', submissionSchema);