const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/staff', require('./routes/staff.routes'));
app.use('/api/laptops', require('./routes/laptop.routes'));
app.use('/api/borrowers', require('./routes/borrower.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Laptop Borrowing Management System API' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
