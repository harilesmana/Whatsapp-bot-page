const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

// Middleware auth
function checkAuth(req, res, next) {
  const token = req.cookies.token;
    if (!token) return res.redirect('/login');

      try {
          const decoded = jwt.verify(token, jwtSecret);
              req.user = decoded;
                  next();
                    } catch (err) {
                        res.clearCookie('token');
                            return res.redirect('/login');
                              }
                              }

                              // Routes
                              router.get('/login', (req, res) => res.render('login'));
                              router.get('/register', (req, res) => res.render('register'));
                              router.get('/dashboard', checkAuth, (req, res) => res.render('dashboard', { user: req.user }));
                              router.get('/logout', (req, res) => {
                                res.clearCookie('token');
                                  res.redirect('/login');
                                  });

                                  // Register
                                  router.post('/register', async (req, res) => {
                                    const { username, password } = req.body;

                                      const exist = await User.findOne({ username });
                                        if (exist) return res.send("Username already taken");

                                          const hashedPassword = await bcrypt.hash(password, 10);
                                            const newUser = new User({ username, password: hashedPassword });

                                              await newUser.save();
                                                res.redirect('/login');
                                                });

                                                // Login
                                                router.post('/login', async (req, res) => {
                                                  const { username, password } = req.body;

                                                    const user = await User.findOne({ username });
                                                      if (!user) return res.send("User not found");

                                                        const valid = await bcrypt.compare(password, user.password);
                                                          if (!valid) return res.send("Wrong password");

                                                            const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret);
                                                              res.cookie('token', token, { httpOnly: true });
                                                                res.redirect('/dashboard');
                                                                });

                                                                module.exports = router;