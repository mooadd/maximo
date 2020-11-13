const PORT = 9000;
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
//const popup = require('popups');
// Getting out json folder
let byteMovies = fs.readFileSync("./public/json/movie-data.json");
let movies = JSON.parse(byteMovies);
// console.log(movies[0]);

// An array to store user information
let users = [];
let userOnline = null;
let people = [];
let peopleId = 1;

// Create application/json parser
const jsonParser = bodyParser.json();
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// THINGS WE NEED
app.use(cors());
app.use(expressLayouts);
app.use(express.static("public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.route("/").get((req, res) => {
  if (req.session.userOnline == null) res.redirect("/Login");
  else {
    res.redirect("/Profile");
  }
});

// LOGIN ROUTE
app
  .route("/Login")
  .get((req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  })
  .post(urlencodedParser, (req, res) => {
    // now, lets check if a username and password is in an the array of users.
    let bool = false;
    try {
      for (let i = 0; i < users.length; i++) {
        if (
          users[i].username === req.body.username &&
          users[i].password === req.body.password
        ) {
          userOnline = users[i];
          console.log("found the user.");
          bool = true;
          res.redirect("/Profile");
          break;
        }
      }

      // if the password or username was wrong, we bring them back here
      if (bool === false) {
        res.redirect("/Login");
      }
    } catch {
      res.redirect("/Login");
    }
  });

// REGISTER ROUTE
app
  .route("/Register")
  .get((req, res) => {
    res.sendFile(__dirname + "/public/sub-files/sign-up.html");
  })
  .post(urlencodedParser, (req, res) => {
    // will get a username, email, password
    try {
      users.push({
        id: Date.now().toString(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        contributing_user: false,
        following: [],
      });
      // If everything goes well. new user gets added to the array. we redirect
      // the user to the login page
      res.redirect("/Login");
    } catch {
      // If there is an error, we redirect the user back to the same page.
      res.redirect("/Register");
    }
  });

// RESET PASSWORD ROUTE
app.route("/Reset-Password").get((req, res) => {
  res.sendFile(__dirname + "/public/sub-files/forgot-pass.html");
});

// MOVIE ROUTE
app.route("/movies").get((req, res) => {
  console.log(req.query);

  // if (req.query.texter === "People") {
  //   console.log("We are going to the people route");
  //   res.redirect(`/People?name=${res.query.search}`);
  // } else {
  res.render("movies", {
    texter: req.query.texter,
    search: req.query.search,
  });
  // }
});

// UNIQUE MOVIE ROUTE
app.route("/movies/:").get((req, res) => {
  console.log("the unique movie id is", req.query);
  res.render("unique-movie", {
    movie_id: req.query.movie_id,
  });
});

// PEOPLE ROUTE
app.route("/People").get((req, res) => {
  console.log("the unique person is", req.query);
  res.render("people", {
    search: req.query.search,
  });
});

// USERS ROUTE
app.route("/users").get((req, res) => {
  console.log("users route", req.query);

  let boolean = false;
  var regExp = /[a-zA-Z]/g;
  let searchValue = req.query.search;

  users.some(function(elem) {
    console.log(elem); //result: "My","name"

    if (elem.username === req.query.search) {
      console.log("found the user!!!!!!!!", req.query.search);
      console.log(elem);
      res.render("users", {name: elem.username, email: elem.email});
      return true;
    }
    else if (elem.username.toUpperCase().includes(searchValue.toUpperCase())){
      console.log(elem);
      res.render("users", {name: elem.username, email: elem.email});
      return true;
    }
    // else {
    //   res.send("User Not found")
    //   return true;
    // }
    //res.send("User Not Found")
    return false;
  });

    //
    //
    // for (let i = 0; i < users.length; i++) {
    //   if (users[i].username === req.query.search) {
    //     console.log("found the user!!!!!!!!", req.query.search);
    //     console.log(users);
    //     res.render("users", {name: users[i].username, email: users[i].email});
    //     break;
    //   }
    //
    //   else if (users[i].username.indexOf(req.query.search) > - 1){
    //     console.log(users);
    //     res.render("users", {name: users[i].username, email: users[i].email});
    //     break;
    //   }
    //
    //   else {
    //       res.send("User Not found")
    //       return true;
    //     }
    // }

});

// UNIQUE MOVIE ROUTE
app.route("/users/:").get((req, res) => {
  console.log("the unique user id is", req.query);
  res.send("<h1>This hasn't been done yet</h1>");
});

// PROFILE ROUTE
app
  .route("/Profile")
  .get((req, res) => {
    if (!userOnline) {
      res.redirect("/Login");
    }
    if (!userOnline.contributing_user) {
      // We go to the normal user profile page
      res.render("normal-user", userOnline);
    } else {
      // We go to the contributing user profile page
      res.render("contributing-user", userOnline);
    }
  })
  .post(urlencodedParser, (req, res) => {
    // console.log(req.body.contributing_user);
    if (req.body.contributing_user === "contributing_user") {
      userOnline.contributing_user = true;
    } else {
      userOnline.contributing_user = false;
    }

    for (let i = 0; i < users.length; i++) {
      if (userOnline.username === users[i].username) users[i] = userOnline;
    }
    res.redirect("/Profile");
  });
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
