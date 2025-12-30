// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import auth from '../middleware/auth.js';
// import Submission from '../models/Submission.js';

// const router = express.Router();
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Configure Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   },
//   fileFilter: function (req, file, cb) {
//     // Allow common file types
//     const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only images, PDFs, and documents are allowed!'));
//     }
//   }
// });

// // Upload Route
// router.post('/upload', auth, upload.single('file'), async (req, res) => {
//   try {
//     const { link } = req.body;
//     const file = req.file;

//     if (!link && !file) {
//       return res.status(400).json({ message: 'Please provide either a link or upload a file' });
//     }

//     let submission;

//     if (file) {
//       // File upload
//       submission = new Submission({
//         user: req.user._id,
//         type: 'file',
//         content: file.path,
//         originalName: file.originalname,
//         fileSize: file.size,
//         mimeType: file.mimetype
//       });
//     } else {
//       // Link submission
//       submission = new Submission({
//         user: req.user._id,
//         type: 'link',
//         content: link
//       });
//     }

//     await submission.save();

//     res.json({
//       message: `${file ? 'File' : 'Link'} uploaded successfully`,
//       submission: {
//         id: submission._id,
//         type: submission.type,
//         content: submission.type === 'file' ? submission.originalName : submission.content,
//         createdAt: submission.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Server error during upload' });
//   }
// });

// // Get user submissions
// router.get('/submissions', auth, async (req, res) => {
//   try {
//     const submissions = await Submission.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(20);

//     const formattedSubmissions = submissions.map(sub => ({
//       id: sub._id,
//       type: sub.type,
//       content: sub.type === 'file' ? sub.originalName : sub.content,
//       originalName: sub.originalName,
//       fileSize: sub.fileSize,
//       mimeType: sub.mimeType,
//       createdAt: sub.createdAt
//     }));

//     res.json({ submissions: formattedSubmissions });
//   } catch (error) {
//     console.error('Get submissions error:', error);
//     res.status(500).json({ message: 'Server error fetching submissions' });
//   }
// });

// export default router;




import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import auth from '../middleware/auth.js';
import Submission from '../models/Submission.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|plain|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed!'));
    }
  }
});

// Upload Route
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { link } = req.body;
    const file = req.file;

    if (!link && !file) {
      return res.status(400).json({ message: 'Please provide either a link or upload a file' });
    }

    let submission;

    if (file) {
      // File upload
      submission = new Submission({
        user: req.user._id,
        type: 'file',
        content: file.path,
        originalName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      });
    } else {
      // Link submission
      submission = new Submission({
        user: req.user._id,
        type: 'link',
        content: link
      });
    }

    await submission.save();

    res.json({
      message: `${file ? 'File' : 'Link'} uploaded successfully`,
      submission: {
        id: submission._id,
        type: submission.type,
        content: submission.type === 'file' ? submission.originalName : submission.content,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Get user submissions
router.get('/submissions', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedSubmissions = submissions.map(sub => ({
      id: sub._id,
      type: sub.type,
      content: sub.type === 'file' ? sub.originalName : sub.content,
      originalName: sub.originalName,
      fileSize: sub.fileSize,
      mimeType: sub.mimeType,
      createdAt: sub.createdAt
    }));

    res.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error fetching submissions' });
  }
});

// Download file route
router.get('/download/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      user: req.user._id,
      type: 'file'
    });

    if (!submission) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = submission.content;
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${submission.originalName}"`);
    res.setHeader('Content-Type', submission.mimeType || 'application/octet-stream');
    
    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error during download' });
  }
});

export default router;