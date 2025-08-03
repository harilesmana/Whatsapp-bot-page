const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

dotenv.config();
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decode = jwt.verify(token,process.env.JWT_SECRET);

    }catch (err){
      res.locals.user = null;
    }
  }else {
    res.locals.user = null;
  }
  next();
})
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layout'); 

// DB Connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
const authRoutes = require('./routes/auth');
const { JsonWebTokenError } = require('jsonwebtoken');
app.use('/', authRoutes);
app.get('/', (req, res) => {
    res.redirect('/login');
    });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ready: http://localhost:${PORT}`));



