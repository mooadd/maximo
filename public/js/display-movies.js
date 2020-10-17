alert('hello world');

let container = document.getElementById('rec-movies');

fetch("../json/movie-data-short.json")
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    printRecMovies(data);
  })

function printRecMovies(list) {
  for (let i=0; i < list.length; i++) {
    console.log(list[i]);
    let html;
    let div = document.createElement('div');

    let title = document.createElement('h3');
    let titleText = document.createTextNode(`Title: ${list[i].Title}`);
    title.appendChild(titleText);
    div.appendChild(title);

    let plot = document.createElement('p');
    let plotText = document.createTextNode(`Description: ${list[i].Plot}`);
    plot.appendChild(plotText);
    div.appendChild(plot);

    // let year = document.createElement('p');
    // let yearText = document.createTextNode(`${list[i].Released}`);
    // year.appendChild(yearText);
    // div.appendChild(year);
    //
    // let runTime = document.createElement('p');
    // let runTimeText = document.createTextNode(`${list[i].Runtime}`);
    // runTime.appendChild(runTimeText);
    // div.appendChild(runTime);











    container.appendChild(div);

  }
}
