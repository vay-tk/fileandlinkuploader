const express = require('express');
const Product = require('../models/Product');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only)
router.post('/', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, imageURL } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, description, price, category' 
      });
    }

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim()
    };

    // Handle image (either URL or uploaded file)
    if (imageURL && imageURL.trim()) {
      productData.imageURL = imageURL.trim();
    } else if (req.file) {
      productData.imagePath = `images/${req.file.filename}`;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);

  } catch (error) {
    console.error('Create product error:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'images', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin only)
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, imageURL } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = parseFloat(price);
    if (category) product.category = category.trim();

    // Handle image update
    if (imageURL && imageURL.trim()) {
      // If switching to URL, clean up old uploaded file
      if (product.imagePath) {
        const oldFilePath = path.join(__dirname, '..', product.imagePath);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
        product.imagePath = undefined;
      }
      product.imageURL = imageURL.trim();
    } else if (req.file) {
      // If uploading new file, clean up old uploaded file
      if (product.imagePath) {
        const oldFilePath = path.join(__dirname, '..', product.imagePath);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      product.imagePath = `images/${req.file.filename}`;
      product.imageURL = undefined;
    }

    await product.save();
    res.json(product);

  } catch (error) {
    console.error('Update product error:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'images', req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join('. ') });
    }

    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Clean up uploaded file if exists
    if (product.imagePath) {
      const filePath = path.join(__dirname, '..', product.imagePath);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

module.exports = router;