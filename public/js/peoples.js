let searchValue = $("#texter").html();
let people = [];
// Now I wan't to display people with that same name lol.

const peopleOutput = (dataObject, searchValue) => {
  let output = "";
  // We return stuff;
  for (let i = 0; i < dataObject.length; i++) {
    let actors = dataObject[i].Actors.split(",");
    let director = dataObject[i].Director;
    let writers = dataObject[i].Writer.split(",");
  }

  console.log(people);

  output = "<h1>This is too hard. I don't know how to do this</h1>";
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
