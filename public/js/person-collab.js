// Everything from the previous js file exists here

// lets find people who frequently worked with nameValue
const findMostWorkedWith = (dataObject, nameValue) => {
  let output = "";

  let workedWith = [];
  for (let i = 0; i < dataObject.length; i++) {
    let director = dataObject[i].Director;
    let actors = dataObject[i].Actors.split(",");

    if (director.includes(nameValue) || actors.includes(nameValue)) {
      if (!director.includes(nameValue)) {
        if (!workedWith.includes(nameValue)) {
          workedWith.push(director);
        }
      } else {
        if (!actors.includes(nameValue)) {
          for (let z = 0; z < actors.length; z++) {
            if (!actors[z].includes(nameValue)) {
              if (!workedWith.includes(actors[z])) {
                workedWith.push(actors[z]);
              }
            }
          }
        }
      }
    }
  }

  // console.log(workedWith);
  output += "<ul>";
  if (workedWith.length <= 5) {
    for (let i = 0; i < workedWith.length; i++) {
      output += "<li>" + workedWith[i] + "</li>";
    }
  } else {
    for (let i = 0; i < 5; i++) {
      output += "<li>" + workedWith[i] + "</li>";
    }
  }

  output += "</ul>";
  return output;

  // This is a pretty mediocre function. needs a fix by deadline
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
