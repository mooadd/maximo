let texterValue = $("#texter").html();
let searchValue = $("#search").html();

// alert(texterValue);
// alert(searchValue);

// Functions

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
                <h5>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <a class="btn btn-success" role="button" href="#">
                      More Info
                    </a>
                  </div>
              </div>
              </div>
            </div>
          `;
    }
  }

  return output;
};

const genreOutput = (dataObject, searchValue) => {
  let output = "";
  // We return stuff;
  //   return "<h1>My name is jeff<h1>";
  for (let i = 0; i < dataObject.length; i++) {
    // console.log('what is up')
    // Old if block "dataObject[i].Title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1"
    // Second if block "dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())"
    if (dataObject[i].Genre.toUpperCase().includes(searchValue.toUpperCase())) {
      console.log(dataObject[i]);
      output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img src="${dataObject[i].Poster}">
                <h5>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <a class="btn btn-success" role="button" href="#">
                      More Info
                    </a>
                  </div>
              </div>
              </div>
            </div>
          `;
    }
  }

  return output;
};

const yearOutput = (dataObject, searchValue) => {
  let output = "";
  // We return stuff;
  //   return "<h1>My name is jeff<h1>";
  for (let i = 0; i < dataObject.length; i++) {
    // console.log('what is up')
    // Old if block "dataObject[i].Title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1"
    // Second if block "dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())"
    if (dataObject[i].Year == searchValue) {
      console.log(dataObject[i]);
      output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img src="${dataObject[i].Poster}">
                <h5>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <a class="btn btn-success" role="button" href="#">
                      More Info
                    </a>
                  </div>
              </div>
              </div>
            </div>
          `;
    }
  }

  return output;
};

const minRatingOutput = (dataObject, searchValue) => {
  let output = "";
  // We return stuff;
  //   return "<h1>My name is jeff<h1>";
  for (let i = 0; i < dataObject.length; i++) {
    // console.log('what is up')
    // Old if block "dataObject[i].Title.toUpperCase().indexOf(searchValue.toUpperCase()) != -1"
    // Second if block "dataObject[i].Title.toUpperCase().includes(searchValue.toUpperCase())"
    // if (dataObject[i].Year == searchValue) {
    console.log(dataObject[i]);
    output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img src="${dataObject[i].Poster}">
                <h5>${dataObject[i].Title}</h5>
                <a data-toggle="collapse" href="#collapseExample${i}" class="btn btn-primary" role="button" aria-expanded="false" aria-controls="collapseExample">
                  Movie Details
                </a>
                <div class="collapse" id="collapseExample${i}">
                  <div class="card card-body">
                    <p>${dataObject[i].Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${dataObject[i].Runtime}<p>
                    <p class="">Release year: ${dataObject[i].Year}<p>
                    <a class="btn btn-success" role="button" href="#">
                      More Info
                    </a>
                  </div>
              </div>
              </div>
            </div>
          `;
    // }
  }

  return output;
};
if (searchValue == "") {
  $("#movies").html(
    "<h1>Enter a word or phrase to search on in the form at the top of the page.</h1>"
  );
} else {
  // We do some fetch request.
  fetch(`../json/movie-data.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let output = "";

      if (texterValue === "Title") {
        output = titleOutput(data, searchValue);
      } else if (texterValue === "Genre") {
        output = genreOutput(data, searchValue);
      } else if (texterValue === "Year") {
        output = yearOutput(data, searchValue);
      } else {
        output = minRatingOutput(data, searchValue);
      }

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });

  //   if (texterValue === "Title") {
  //     $("#movies").html("<h1>This is going to be based off title</h1>");
  //   } else if (texterValue === "Genre") {
  //     $("#movies").html("<h1>This is going to be based off Genre</h1>");
  //   } else if (texterValue === "Year") {
  //     $("#movies").html("<h1>This is going to be based off Year</h1>");
  //   } else {
  //     $("#movies").html("<h1>This is going to be based off MinRating</h1>");
  //   }
}
