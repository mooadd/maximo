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
let users = [
  {
    id: 1,
    username: "abdi",
    email: "abdi@abdi",
    password: "abdi",
    contributing_user: true,
    following: [],
    followers: [],
    peopleFollowing: [],
    comments: [],
    ratings: [],
  },
  {
    id: 1,
    username: "jamie",
    email: "jamie@jones",
    password: "jamie",
    contributing_user: true,
    following: [],
    followers: [],
    peopleFollowing: [],
    comments: [],
    ratings: [],
  },
];
let userOnline = null; // Giving it a default value of null.
let userSearched = null;
let personSearched = null;

// const commentData = fs.readFileSync("./public/json/movie-comments.json");
// let comments = JSON.parse(commentData);

let movieComments = [];
let movieRatings = [];

// People stuff. Populating it.
let people = [];
const data = fs.readFileSync("./public/json/movie-data.json");
let movies = JSON.parse(data);
for (let i = 0; i < movies.length; i++) {
  let actors = movies[i].Actors.split(",");
  let director = movies[i].Director;
  // let writers = movies[i].Writer.split(/[,]+/);

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
    let userExists = false;
    for (let i = 0; i < users.length; i++) { 
      if (users[i].email.toUpperCase() === req.body.email.toUpperCase() ||
        users[i].username.toUpperCase() === req.body.username.toUpperCase()) { 
        userExists = true;
        }
    }

    if (!userExists) {
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
          ratings: [],
        });
        // If everything goes well. new user gets added to the array. we redirect
        // the user to the login page
        res.redirect("/Login");
      } catch {
        // If there is an error, we redirect the user back to the same page.
        res.redirect("/Register");
      }
    } else { 
      res.redirect('/Register')
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
    res.render("movies", {
      userOnline: userOnline,
      texter: req.query.texter,
      search: req.query.search,
    });
  })
  .post(urlencodedParser, (req, res) => {

    let title = req.body.Title;
    let actors = req.body.Actors.split(",");
    let genres = req.body.Genres;
    let languages = req.body.Languages;
    let runtime = req.body.Runtime;
    let releaseYear = req.body.releaseyear;
    let rated = req.body.Rated;
    let plot = req.body.Plot;
    let image = req.body.Image;
    let dir = req.body.dir;

    for (let i = 0; i < actors.length; i++) {
      if (!people.includes(actors[i])) {
        people.push(actors[i]);
      }
    }

    if (!people.includes(dir)) {
      people.push(dir);
    }

    // now we just add to the database

    let movieObject = {
      Actors: req.body.Actors,
      Title: req.body.Title,
      Genre: req.body.Genres,
      Language: req.body.Languages,
      Rated: req.body.Rated,
      Plot: req.body.Plot,
      Poster: req.body.Image,
      Runtime: req.body.Runtime,
      Year: req.body.releaseyear,
      Director: req.body.dir,
      Writer: "",
      Comments: [],
      Ratings: [],
    };

    // let stringedMovie = JSON.stringify(movieObject, null, 2);

    movies.push(movieObject);

    fs.writeFile(
      "./public/json/movie-data.json",
      JSON.stringify(movies, null, 2),
      finished
    );
    res.redirect("/Profile");

    function finished(err) {
    }
  });

// UNIQUE MOVIE ROUTE
app.route("/movies/:").get((req, res) => {
  res.render("unique-movie", {
    userOnline: userOnline,
    movie_id: req.query.movie_id,
  });
});

// PEOPLE ROUTE
app
  .route("/People")
  .get((req, res) => {

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
    res.redirect("/Profile");
  });

// USERS ROUTE
app
  .route("/users")
  .get((req, res) => {
    const usernameUpper = req.query.search.toUpperCase();

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
    res.redirect("/Profile");
  });

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
  res.redirect("/Login");
});

app.route("/add-movie").get((req, res) => {
  res.render("movie-add", userOnline);
});

app
  .route("/add-person")
  .get((req, res) => {
    res.render("person-add", userOnline);
  })
  .post(urlencodedParser, (req, res) => {
    if (!people.includes(req.body.name)) {
      people.push(req.body.name);
    }
    res.redirect("/Profile");
  });

app.route("/add-comment").post(urlencodedParser, (req, res) => {
  let comment = req.body.comment;
  let movieId = req.body.id;
  let movieTitle = req.body.title;

  let commentObj = {
    id: movieId,
    comment: comment,
    title: movieTitle,
  };
  movieComments.push(commentObj);

  userOnline.comments.push(commentObj);
  // now lets update that for the users
  for (let i = 0; i < users.length; i++) {
    if (users.username === userOnline.username) {
      users[i] = userOnline;
      userOnline = users[i];
      break;
    }
  }

  // Lets add the comment to the movie comments

  movies[movieId].Comments.push(req.body.comment); // We added a comment to this movie

  fs.writeFile(
    "./public/json/movie-data.json",
    JSON.stringify(movies, null, 2),
    finished
  );
  res.redirect("/Profile");

  function finished(err) {
  }
});

app.route("/rating").post(urlencodedParser, (req, res) => {
  let rating = req.body.rating;
  let movieId = req.body.id;
  let title = req.body.title;

  ratingObj = {
    rating: rating,
    id: movieId,
    title: title,
  };
  userOnline.ratings.push(ratingObj);
  movieRatings.push(ratingObj);

  for (let i = 0; i < users.length; i++) {
    if (users.username === userOnline.username) {
      users[i] = userOnline;
    }
  }

  // Lets add the rating to the movie ratings
  movies[movieId].Ratings.push(req.body.rating); // We added a comment to this movie

  fs.writeFile(
    "./public/json/movie-data.json",
    JSON.stringify(movies, null, 2),
    finished
  );
  res.redirect("/Profile");

  function finished(err) {
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
