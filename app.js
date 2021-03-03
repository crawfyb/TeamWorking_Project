const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');



dotenv.config({
  path: './passwords.env'
})

const app = express();

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({
  extended: false
}))

//Connect to database (passwords.env)
const db = mysql.createConnection({
  host: process.env.database_host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database,
});

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

app.set('view engine', 'hbs');





//Check database connection
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL connected...");
  }
})



//define routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

//Check localhost connection
app.listen(5000, () => {
  console.log("Server started on Port 5000");
})
