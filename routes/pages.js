const express = require('express');
const authController = require('../controllers/auth');
const mysql = require("mysql");


const router = express.Router();

const db = mysql.createConnection({
  host: process.env.database_host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database,
  socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'

 });

router.get('/', authController.isLoggedIn,(req, res) => {
  res.render('index', { user: req.user
  });

});

router.get('/loggedIn', (req, res) => {
  res.render('loggedIn');
});


router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/shop', (req, res) => {
  db.query("SELECT * FROM product", function (err, results, fields) {

    //res.render('shop');

    res.send(fields);
});
});

router.get('/cart', (req, res) => {
  res.render('cart');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  //console.log(req.user);
  if (req.user) {
    res.render('profile', {
      user: req.user
    });
  }
  else {
    res.redirect('/login');
  }

});

module.exports = router;
