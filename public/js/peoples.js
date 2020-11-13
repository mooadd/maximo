let searchValue = $("#search").html();
let people = [];
// Now I wan't to display people with that same name lol.

const peopleOutput = (dataObject, searchValue) => {
  let output = "";
  console.log(dataObject);
  // We return stuff;

  for (let i = 0; i < dataObject.length; ++i)
      for (let j = 0; j < dataObject.length; ++j)
          if (i !== j && dataObject[i].Actors === dataObject[j].Actors && dataObject[i].Director === dataObject[j].Director
          && dataObject[i].Writer === dataObject[j].Writer)
              dataObject.splice(j, 1);
  console.log(dataObject);


  for (let i = 0; i < dataObject.length; i++) {
    let actors = dataObject[i].Actors.split(",");
    let director = dataObject[i].Director;
    let writers = dataObject[i].Writer.split(",");

    if (dataObject[i].Director.toUpperCase().includes(searchValue.toUpperCase()) ) {

    output += `
    <div class="people">
      <div class="well text-center">
      <form action="/movies/:">
        <input type="text" id="movie_id" name="movie_id" value="${i}">
        <a href="#">
          ${dataObject[i].Director} (Director)
        </a>
      </form>
      </div>
    </div>

    `;
    }

    else if (dataObject[i].Actors.toUpperCase().includes(searchValue.toUpperCase()) ) {

    output += `
    <div class="people">
      <div class="well text-center">
        <a href="/Login">
          ${dataObject[i].Actors} (Actor)
        </a>
      </div>
    </div>
    `;
  }

    else if (dataObject[i].Writer.toUpperCase().includes(searchValue.toUpperCase()) ) {

    output += `
    <div class="people">
      <div class="well text-center">
        <a href="/Login">
          ${dataObject[i].Writer} (Writer)
        </a>
      </div>
    </div>
    `;
  }

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

      output = peopleOutput(data, searchValue);

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
