const PORT = 9000
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');

// An array to store user information
let users = [];

// Create application/json parser
const jsonParser = bodyParser.json();

// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false})

// https://stackoverflow.com/questions/9177049/express-js-req-body-undefined

// app.use(bodyParser())
app.use(cors())
app.use(expressLayouts);
app.use(express.static('public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/Login', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.post('/Login', urlencodedParser, (req, res) => {
  // now, lets check if a username and password is in an the array of users.
  let bool = false;
  try {
    for (let i=0; i < users.length ; i++) {
      if ((users[i].username === req.body.username) && (users[i].password === req.body.password)) {
        console.log('found the user.')
        bool = true;
        res.render('about', {
          username: req.body.username
        })
        break;
      }
    }

    // if the password or username was wrong, we bring them back here
    if (bool === false) {
      res.redirect('/Login')
    }
  } catch {
    res.redirect('/Login')
  }
})

app.get('/Register', (req, res) => {
    res.sendFile(__dirname + "/public/sub-files/sign-up.html");
})

app.post('/Register', urlencodedParser,  (req, res) => {
  // will get a username, email, password
  try {
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    // If everything goes well. new user gets added to the array. we redirect
    // the user to the login page
    res.redirect('/Login')
  } catch {
    // If there is an error, we redirect the user back to the same page.
    res.redirect('/Register')
  }
})

app.get('/Reset-Password', (req, res) => {
    res.sendFile(__dirname + "/public/sub-files/forgot-pass.html");
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

// I have installed nodemon. to run, you simply type (nodemon) in the shell.
// If you want to know more about nodemon, try searching it yourself.
// Also, instead of running 'node app.js', I made it so that you can just type
// 'npm start' to get the server to run.
