let movie_id = $("#unique-movie-thing").html();
alert(movie_id);

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
    console.log(desiredObject);
    let output = "";

    output += `
            <div class="unique-movie-size">
              <div class="well text-center">
                <img src="${desiredObject.Poster}">
                <h5>${desiredObject.Title}</h5>
                  <div class="card card-body">
                    <p>${desiredObject.Plot}<p>
                    <p>Maximo rating: 0<p>
                    <p class="">Runtime: ${desiredObject.Runtime}<p>
                    <p class="">Release year: ${desiredObject.Year}<p>
                    <p class="">Director: ${desiredObject.Director}<p>
                    <p class="">Actors: ${desiredObject.Actors}<p>
                    <p class="">Genres: ${desiredObject.Genre}<p>
                    <p class="">Rated: ${desiredObject.Rated}<p>
                    <p class="">Movie language: ${desiredObject.Language}<p>
                  </div>
              </div>
            </div>
            
          `;

    $("#movies").html(output);
  })
  .catch((err) => {
    console.log(err);
  });
