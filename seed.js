const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('✅ MongoDB Connected - Seeding Data');

    await Product.deleteMany(); // Clears existing products
    await Product.insertMany([
        { name: 'Fresh Chicken', description: 'High-quality free-range chicken.', price: 20, image: '/images/chicken.jpg' },
        { name: 'Organic Eggs', description: 'Farm-fresh organic eggs.', price: 5, image: '/images/eggs.jpg' },
        { name: 'Natural Manure', description: 'Organic manure for your crops.', price: 15, image: '/images/manure.jpg' }
    ]);

    console.log('✅ Products Seeded!');
    process.exit();
}).catch(err => {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
});
