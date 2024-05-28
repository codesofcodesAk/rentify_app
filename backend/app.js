const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./schemas/userSchema');
const Property = require('./schemas/propertySchema');
const mongoose = require('mongoose');
const cors = require('cors');


// Connection URL
const mongoURI = 'mongodb://localhost:27017/rentifyDB';


// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });




const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  // Add your SMTP configuration here
});

// JWT secret key
const jwtSecret = 'yourSecretKey';

// Helper function for authenticating token
function authenticateToken(req, res, next) {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) return res.status(401).send('Access denied');
    // Extract the token without the "Bearer " prefix
    const token = authorizationHeader.split(' ')[1];
    
    try {
      const verified = jwt.verify(token, jwtSecret);
      req.user = verified;
      next();
    } catch (error) {
      console.error(error);
      res.status(400).send('Invalid token');
    }
  }
  

// User registration endpoint
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, role });
  await user.save();
  res.status(201).send('User registered');
});

// User login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
  res.json({ token , data : user });
});

// Seller property management endpoints
app.post('/properties', authenticateToken, async (req, res) => {
  const property = new Property({ ...req.body, seller: req.user.userId });
  await property.save();
  res.status(201).send('Property created');
});

app.get('/properties', authenticateToken, async (req, res) => {
  const properties = await Property.find({ seller: req.user.userId });
  res.json(properties);
});

app.put('/properties/:id', authenticateToken, async (req, res) => {
  await Property.findByIdAndUpdate(req.params.id, req.body);
  res.send('Property updated');
});

app.delete('/properties/:id', authenticateToken, async (req, res) => {
  await Property.findByIdAndDelete(req.params.id);
  res.send('Property deleted');
});

// Buyer functionality endpoints
app.get('/properties/all', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const properties = await Property.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('seller', 'firstName lastName email phoneNumber')
    .exec();
  const count = await Property.countDocuments();
  res.json({
    properties,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
});

app.post('/interested/:propertyId', authenticateToken, async (req, res) => {
  const property = await Property.findById(req.params.propertyId).populate('seller', 'email');
  if (!property) return res.status(404).send('Property not found');
  
  const buyer = await User.findById(req.user.userId);

  const mailOptionsSeller = {
    from: 'no-reply@rentify.com',
    to: property.seller.email,
    subject: 'A buyer is interested in your property',
    text: `Buyer Details: \nName: ${buyer.firstName} ${buyer.lastName}\nEmail: ${buyer.email}\nPhone: ${buyer.phoneNumber}`
  };

  const mailOptionsBuyer = {
    from: 'no-reply@rentify.com',
    to: buyer.email,
    subject: 'You showed interest in a property',
    text: `Seller Details: \nName: ${property.seller.firstName} ${property.seller.lastName}\nEmail: ${property.seller.email}\nPhone: ${property.seller.phoneNumber}`
  };

  transporter.sendMail(mailOptionsSeller);
  transporter.sendMail(mailOptionsBuyer);

  res.send('Interest shown, details sent via email');
});

// Real-time like button functionality
app.post('/properties/:id/like', authenticateToken, async (req, res) => {
  const property = await Property.findById(req.params.id);
  property.likes = property.likes ? property.likes + 1 : 1;
  await property.save();
  res.json({ likes: property.likes });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
