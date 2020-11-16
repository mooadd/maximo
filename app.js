const PORT = 9000;
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const { dir } = require("console");
//const popup = require('popups');
// Getting out json folder
// let byteMovies = fs.readFileSync("./public/json/movie-data.json");
// let movies = JSON.parse(byteMovies);
// console.log(movies[0]);

// An array to store user information
let users = [];
let userOnline = null;
let userSearched = null;
let personSearched = null;

// People stuff. Populating it.
let people = [];
const data = fs.readFileSync("./public/json/movie-data.json");
let movies = JSON.parse(data);
for (let i = 0; i < movies.length; i++) {
  let actors = movies[i].Actors.split(",");
  let director = movies[i].Director;
  let writers = movies[i].Writer.split(/[,]+/);

  for (let i = 0; i < actors.length; i++) {
    if (!people.includes(actors[i])) {
      people.push(actors[i]);
    }
  }

  if (!people.includes(director)) {
    people.push(director);
  }

  // I will get to this some other day. for now, actors and directors
  // for (let i = 0; i < writers.length; i++) {
  //   if (!people.includes(writers[i])) {
  //     people.push(writers[i]);
  //   }
  // }

  // console.log(people);
}

// Create application/json parser
const jsonParser = bodyParser.json();
// Create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// THINGS WE NEED
app.use(cors());
app.use(expressLayouts);
app.use(express.static("public"));
// app.use('/css', express.static(__dirname + 'public/css'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// This route does nothing
app.route("/").get((req, res) => {});

// LOGIN ROUTE
app
  .route("/Login")
  .get((req, res) => {
    if (userOnline != null) {
      res.redirect("/Profile");
    } else {
      res.sendFile(__dirname + "/public/index.html");
    }
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
          console.log(userOnline);
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
    if (userOnline != null) {
      console.log("got here");
      res.redirect("/Profile");
    } else {
      res.sendFile(__dirname + "/public/sub-files/sign-up.html");
    }
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
        followers: [],
        peopleFollowing: [],
        comments: [],
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
app
  .route("/movies")
  .get((req, res) => {
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
  })
  .post(urlencodedParser, (req, res) => {
    console.log(req.body);
  });

// UNIQUE MOVIE ROUTE
app.route("/movies/:").get((req, res) => {
  console.log("the unique movie id is", req.query);
  res.render("unique-movie", {
    movie_id: req.query.movie_id,
  });
});

// PEOPLE ROUTE
app
  .route("/People")
  .get((req, res) => {
    console.log("the unique person is", req.query);

    if (!people.includes(req.query.search)) {
      res.redirect("/Profile");
    } else {
      let index = people.indexOf(req.query.search);
      personSearched = req.query.search;
      if (userOnline.peopleFollowing.includes(req.query.search)) {
        res.render("person", {
          follow: "unfollow",
          username: userOnline.username,
          name: req.query.search,
        });
      } else {
        res.render("person", {
          follow: "follow",
          username: userOnline.username,
          name: req.query.search,
        });
      }
    }
  })
  .post(urlencodedParser, (req, res) => {
    if (req.body.follow === "follow") {
      userOnline.peopleFollowing.push(personSearched);
    } else {
      index = userOnline.peopleFollowing.indexOf(personSearched);
      userOnline.peopleFollowing.splice(index, 1);
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].username == userOnline.username) {
        users[i] = userOnline;
      }
    }

    console.log(req.body);
    console.log("userOnline people following", userOnline.peopleFollowing);

    res.redirect("/Profile");
  });

// USERS ROUTE
app
  .route("/users")
  .get((req, res) => {
    console.log(req.query.search);
    const usernameUpper = req.query.search.toUpperCase();
    console.log(usernameUpper);

    if (usernameUpper === userOnline.username.toUpperCase()) {
      res.redirect("/Profile");
    } else {
      for (let i = 0; i < users.length; i++) {
        if (users[i].username.toUpperCase() === usernameUpper) {
          userSearched = users[i];

          if (userOnline.following.includes(users[i].username)) {
            res.render("user-view", {
              follow: "unfollow",
              username: userOnline.username,
              foundUser: users[i],
            });
          } else {
            res.render("user-view", {
              follow: "follow",
              username: userOnline.username,
              foundUser: users[i],
            });
          }
        }
      }
    }
  })
  .post(urlencodedParser, (req, res) => {
    // userSearched.followers.push(userOnline.username);
    // userOnline.following.push(userSearched.username);

    // for (let i = 0; i < users.length; i++) {
    //   if (users[i].username == userSearched.username) {
    //     users[i] = userSearched;
    //   }
    //   if (users[i].username == userOnline.username) {
    //     users[i] = userOnline;
    //   }
    // }

    if (req.body.follow === "follow") {
      userSearched.followers.push(userOnline.username);
      userOnline.following.push(userSearched.username);
    } else {
      let index = userSearched.followers.indexOf(userOnline.username);
      userSearched.followers.splice(index, 1);

      index = userOnline.following.indexOf(userSearched.username);
      userOnline.following.splice(index, 1);
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].username == userSearched.username) {
        users[i] = userSearched;
      }
      if (users[i].username == userOnline.username) {
        users[i] = userOnline;
      }
    }

    console.log(req.body);
    console.log("userOnline following", userOnline.following);

    res.redirect("/Profile");
  });

// UNIQUE MOVIE ROUTE
// .app.route("/users/:")
// .get((req, res) => {
//   console.log("the unique user id is", req.query);
//   res.send("<h1>This hasn't been done yet</h1>");
// });

// PROFILE ROUTE
app
  .route("/Profile")
  .get((req, res) => {
    if (userOnline == null) {
      res.redirect("/Login");
    } else {
      if (!userOnline.contributing_user) {
        // We go to the normal user profile page
        res.render("normal-user", userOnline);
      } else {
        // We go to the contributing user profile page
        res.render("contributing-user", userOnline);
      }
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

// LOGOUT ROUTE
app.route("/Logout").get((req, res) => {
  userOnline = null;
  console.log(userOnline);
  res.redirect("/Login");
});

app.route("/add-movie").get((req, res) => {
  res.render("movie-add", userOnline);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
