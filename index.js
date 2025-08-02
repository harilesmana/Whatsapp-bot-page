const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
    useUnifiedTopology: true
    });

    // Routes
    const authRoutes = require('./routes/auth');
    app.use('/', authRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    