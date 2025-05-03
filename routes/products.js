const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const app = express();

// GET all products and render the page
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      console.log('Products from database:', products);  // This logs all product objects with their _id
      res.render('products', { products, user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  // Example in index.js or routes/product.js:
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      // Pass req.user (which may be null if not logged in) to the view
      res.render('products', { products, user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;

