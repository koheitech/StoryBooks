'use strict';

const express = require('express');
const router = express.Router();

// @descr    Login/Landing page
// @route    GET /
router.get('/', (req, res) => {
  res.render('login');
});

// @descr    Dashboard
// @route    GET /dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


module.exports = router;
