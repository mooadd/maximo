const PORT = 9000;
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");

// An array to store user information
let users = [];
let userOnline;

// Create application/json parser
const jsonParser = bodyParser.json();
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// THINGS WE NEED
app.use(cors());
app.use(expressLayouts);
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
  res.send("users");
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
