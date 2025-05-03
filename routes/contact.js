const express = require('express');
const router = express.Router();

// GET Contact Page
router.get('/', (req, res) => {
    res.render('contact');  // Make sure you have 'views/contact.ejs'
});

module.exports = router;
