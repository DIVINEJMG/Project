const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Register Route (GET)
router.post('/register', async (req, res) => {
  const username = req.body.username.trim();
const password = req.body.password.trim();

  

  try {
    console.log("🔍 Checking if user already exists:", username);
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.error("❌ User already exists:", username);
      req.flash('error_msg', 'Username already exists.');
      return res.redirect('/auth/register');
    }

    console.log("✅ User does not exist, proceeding to hash password.");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Hashed Password:", hashedPassword);

    const newUser = new User({
      username,
      password: hashedPassword,
      verified: false, 
    });

    const savedUser = await newUser.save();
    console.log("✅ User successfully registered:", savedUser);

    req.flash('success_msg', 'Registration successful! You can now log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('❌ Registration Error:', error);
    req.flash('error_msg', 'Something went wrong. Try again.');
    res.redirect('/auth/register');
  }

});



// Login Route (GET)
router.post('/login', async (req, res, next) => {
  const username = req.body.username.trim();
const password = req.body.password.trim();

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error('❌ Authentication Error:', err);
      return next(err);
    }
    if (!user) {
      console.error('❌ User not found:', req.body.username);
      req.flash('error_msg', 'User not found. Please register.');
      return res.redirect('/auth/login');
    }

    console.log("🔍 Checking password for:", user.username);
    console.log("🔍 Entered Password:", req.body.password);
    console.log("🔍 Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      console.error('❌ Password did not match');
      req.flash('error_msg', 'Incorrect password. Try again.');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('❌ Login Error:', err);
        return next(err);
      }

      req.flash('success_msg', 'Successfully logged in!');
      console.log("✅ Login Successful!");
      return res.redirect('/');
    });
  })(req, res, next);
});



// Show the registration form (GET)
router.get('/register', (req, res) => {
  res.render('register'); // Ensure 'register.ejs' exists in views folder
});

// Show the login form (GET)
router.get('/login', (req, res) => {
  res.render('login'); // Ensure 'login.ejs' exists in views folder
});



// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return next(err);
    }
    req.flash('success_msg', 'You have been logged out.');
    res.redirect('/auth/login');
  });
});

module.exports = router;



