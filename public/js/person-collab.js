// Everything from the previous js file exists here

// lets find people who frequently worked with nameValue
const findMostWorkedWith = (dataObject, nameValue) => {
  let output = "";
  // So the game plan is to load an array of objects.
  // we add whoever worked with the guy. If there are less
  // than 5 unique people, we just print out all of their names
  // If there is more than that, we print out the five people
  // that have the most movies with the guy. Simple. We list
  // a max of 5 people only

  let workedWith = []; // This is gonna have an array of objects
  // Using the model ({name: ...., howManyTimesWorkedWith: ....})
  for (let i = 0; i < dataObject.length; i++) {
    let director = dataObject[i].Director;
    let actors = dataObject[i].Actors.split(",");

    if (director.includes(nameValue)) { 
      console.log('bad')
    }


  console.log(workedWith);

  return output;
};

// We do some fetch request.
fetch(`../json/movie-data.json`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    let output = findMostWorkedWith(data, nameValue);

    $("#people-worked").html(output);
  })
  .catch((err) => {
    console.log(err);
  });
