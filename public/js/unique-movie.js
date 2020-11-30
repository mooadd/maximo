let movie_id = $("#unique-movie-thing").html();

// alert(texterValue);
// alert(searchValue);

// Functions

// Rating Initialization
$(document).ready(function () {
  $("#rateMe4").mdbRate();
});

/**
 * @description determine if an array contains one or more items from another array.
 * @param {array} haystack the array to search.
 * @param {array} arr the array providing items to check for in the haystack.
 * @return {boolean} true|false if haystack contains at least one item from arr.
 */
const findOne = function (haystack, arr) {
  return arr.some(function (v) {
    return haystack.indexOf(v) >= 0;
  });
};
// returns random values in an array
function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const addRelatedMovied = (arr) => {
  let outputVariable = "";
  let smallerSimilarMovies;
  if (arr.length == 1) {
    smallerSimilarMovies = getRandom(arr, 1);
  } else if (arr.length == 2) {
    smallerSimilarMovies = getRandom(arr, 2);
  } else if (arr.length == 3) {
    smallerSimilarMovies = getRandom(arr, 3);
  } else if (arr.length == 4) {
    smallerSimilarMovies = getRandom(arr, 4);
  } else if (arr.length == 5) {
    smallerSimilarMovies = getRandom(arr, 5);
  } else {
    smallerSimilarMovies = getRandom(arr, 6);
  }
  console.log(smallerSimilarMovies);

  for (let i = 0; i < smallerSimilarMovies.length; i++) {
    outputVariable += `<div class="col-md-2">
        <img src="${smallerSimilarMovies[i].data.Poster}">
                            <form action="/movies/:">
                      <input type="text" id="movie_id" name="movie_id" value="${smallerSimilarMovies[i].index}">
                      <button class="btn btn-info" role="button" href="#">
                        Go
                      </button>
                    </form>
      </div>`;
  }

  return outputVariable;
};

const titleOutput = (dataObject, searchValue) => {
  let output = "";
  // We return stuff;
  //   return "<h1>My name is jeff<h1>";
  for (let i = 0; i < dataObject.length; i++) {
    // console.log('what is up')
    // Old if block "dataObject[i].Title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1"
    // Second if block "dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())"
    if (dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())) {
      console.log(dataObject[i]);
      output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img src="${dataObject[i].Poster}">
                <h5 style="color:yellow;>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <form action="/movies/:">
                      <input type="text" id="movie_id" name="movie_id" value="${i}">
                      <button class="btn btn-success" role="button" href="#">
                        More Info
                      </button>
                    </form>
                  </div>
              </div>
              </div>
            </div>
          `;
    }
  }

  return output;
};

// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let desiredObject = data[movie_id];
    let genres = desiredObject.Actors.split(",");
    // let director = desiredObject.Director;
    // let writers = desiredObject.Writer.split(",");
    // console.log(genres);
    // console.log(director);
    // console.log(writers);
    console.log(desiredObject);

    let similarMovies = [];
    for (let i = 0; i < data.length; i++) {
      let genresOf = data[i].Actors.split(",");
      // let directorOf = data[i].Director;
      // let writersOf = data[i].Writer.split(",");
      // test for genres
      if (findOne(genresOf, genres)) {
        if (desiredObject != data[i])
          similarMovies.push({
            data: data[i],
            index: i,
          });
      }
    }
    // Found similar movies lol.
    console.log(similarMovies);
    let outputVariable = "";
    if (similarMovies.length > 0) {
      outputVariable = addRelatedMovied(similarMovies);
    } else {
      outputVariable += '<p class="text-muted">No related movies<p>';
    }

    // console.log("output variable equals:", outputVariable);
    let output = "";
    let comments = "";
    let rating;

    // Add to the comments
    for (let i = 0; i < desiredObject.Comments.length; i++) {
      comments += "<p>";
      comments += desiredObject.Comments[i];
      comments += "<p>";
    }

    if (desiredObject.Ratings.length < 1) {
      rating = 0;
    } else {
      // get the average rating
      let ratingSum = 0;
      for (let i = 0; i < desiredObject.Ratings.length; i++) {
        ratingSum += parseInt(desiredObject.Ratings[i]);
      }

      rating = ratingSum / desiredObject.Ratings.length;
    }

    output += `
            <div class="unique-movie-size">
              <div class="well text-center">
                <img src="${desiredObject.Poster}">
                <h5 style="color:yellow;>${desiredObject.Title}</h5>
                  <div class="card card-body">
                    <p>${desiredObject.Plot}<p>
                    <p>${rating}<p>
                    <p class="">Runtime: ${desiredObject.Runtime}<p>
                    <p class="">Release year: ${desiredObject.Year}<p>
                    <p class="">Director: ${desiredObject.Director}<p>
                    <p class="">Actors: ${desiredObject.Actors}<p>
                    <p class="">Genres: ${desiredObject.Genre}<p>
                    <p class="">Rated: ${desiredObject.Rated}<p>
                    <p class="">Movie language: ${desiredObject.Language}<p>
                  </div>
                  <hr>
                  <h3 style="color: white;" class="text">Similar movies</h3>
                  <div class='similar-movies'>
                      <div class="card card-body">
                        <div class="row justify-content-center">
                          ${outputVariable}
                        </div>
                      </div>
                  </div>

                  <div>
                    <form class="my-4" action="/add-comment" method="POST">
                      <h4 style="color: white;">Comments</h4>
                      <hr>

                      <div class="form-group">
                        <textarea class="form-control" id="comment" name="comment" rows="3"></textarea>
                        <input style="display:none" type='text' name="id" value=${movie_id}>
                        <input style="display:none" type='text' name='title' value=${desiredObject.Title}>
                        <div class="d-flex flex-row-reverse my-2">
                          <button type="submit" class="btn btn-secondary">Add comment</button>
                        </div>


                      </div>

                      
                    </form>

                    <div style="background: red;" class="">
                      ${comments}
                    </div>

                  </div>
              </div>
            </div>

          `;

    $("#movies").html(output);

    $("#title").val(desiredObject.Title);
  })
  .catch((err) => {
    console.log(err);
  });
