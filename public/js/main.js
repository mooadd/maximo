// http://www.omdbapi.com/?apikey=[yourkey]&
const key = '9e8fdc9';

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  fetch(`../json/movie-data.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data)

      let output = '';
      for (let i=0; i < data.length; i++) {
        // console.log('what is up')
        if (data[i].Title.toUpperCase().indexOf(searchText.toUpperCase()) != -1) {
          console.log(data[i]);
            output += `
              <div class="col-md-3">
                <div class="well text-center">
                  <img src="${data[i].Poster}">
                  <h5>${data[i].Title}</h5>
                  <a onclick="movieSelected('${data[i].imdbID}')" class="btn btn-primary" href='#'>Movie Details</a>
                </div>
              </div>
            `;
        }
      }

      $('#movies').html(output);

    })
    .catch((err) =>{
      console.log(err);
    })
}
