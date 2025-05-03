const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Authentication routes
const productRoutes = require('./routes/products'); // Product routes
const contactRoutes = require('./routes/contact');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const passportConfig = require('./passport-config');
passportConfig(passport);
const dotenv = require('dotenv');
const cors = require('cors');
const cartRoutes = require('./routes/cart');




// Connect to MongoDB (✅ Only Once)
const dbURI = 'mongodb+srv://divineogadinma2023:IIDhG4uQCqNiBQLN@cluster0.og77s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));


// Dummy product data
const products = [
  { id: 1, name: "Fresh Chicken", category: "Chickens", price: 20, description: "High-quality free-range chicken." },
  { id: 2, name: "Organic Eggs", category: "Eggs", price: 5, description: "Farm-fresh organic eggs." },
  { id: 3, name: "Natural Manure", category: "Manure", price: 15, description: "Organic manure for your crops." }
];


const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set view engine for EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes); // Authentication routes (Login, Register, Password Reset)
app.use('/products', productRoutes); // Product routes


// Homepage Route
app.get('/', (req, res) => {
  res.render('index', { title: 'DSO Glorious Poultry Farm', user: req.user });
});


app.get('/products', (req, res) => {
  res.render('products', { title: 'Our Products', products, user: req.user });

});

// About Page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Services Page
app.get('/services', (req, res) => {
  res.render('services', { title: 'Our Services' });
});

// FAQ Page
app.get('/faq', (req, res) => {
  res.render('faq', { title: 'Frequently Asked Questions' });
});





app.get('/contact-form', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});
app.post('/contact-form', (req, res) => {
  const { name, email, message } = req.body;
  res.send('Thank you for contacting us!');
});


dotenv.config();
app.use('/contact', contactRoutes);

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/auth', authRoutes);
// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});