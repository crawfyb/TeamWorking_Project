const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {promisify} = require('util');



//connection to database (passwords.env)
const db = mysql.createConnection({
  host: process.env.database_host,
  user: process.env.database_user,
  password: process.env.database_password,
  database: process.env.database,
  socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'

});




//login for current customers function
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render('login', {

        message: "Please provide username and password"

      })
    }
    db.query('SELECT * FROM customers WHERE username = ?', [username], async (error, results) => {
    //  console.log(results);
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('login', {
          message: "Email or Password is incorrect"
        })
      } else {
        const id = results[0].id;

        const token = jwt.sign({
          id: id
        }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        //console.log("The token is: " + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect("/profile");


      }
    })
  } catch (error) {
    console.log(error);
  }


}




//register new customer function
exports.register = (req, res) => {
  //console.log(req.body);

  const {
    name,
    username,
    email,
    password,
    passwordConfirm
  } = req.body;

  db.query('SELECT email from customers WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }

    if (results.length > 0) {
      return res.render('register', {
        message: "That email is already in use"
      })
    } else if (password !== passwordConfirm) {
      return res.render('register', {
        message: "Password does not match"
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
  //  console.log(hashedPassword);

    db.query('INSERT INTO customers SET ?', {
      name: name,
      username: username,
      email: email,
      password: hashedPassword
    }, (error, results) => {
      if (error) {
        console.log(error);
      } else {
      //  console.log(results);
        res.render('register', {
          message: 'User Registered'
        })
      }
    })
  });
}


//function to verify if user is logged in
exports.isLoggedIn = async (req, res, next) => {
  //console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      //verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET
      );
        //console.log(decoded);

        //check if the user still exists
        db.query('SELECT * FROM customers WHERE id = ?', [decoded.id], (error, result) => {
        //  console.log(result);

          if (!result) {
            return next();
          }

          req.user = result[0];
          return next();

        });

    } catch (error) {
      console.log(error);
      return next();
    }
  }else {
    next();

  }

}


//function
exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2 *1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}
