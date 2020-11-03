// These functions just change the dropdowns text.
const changeToTitle = () => {
  $("#dropdown-button").text("Title");
  $("#texter").val("Title");
};
const changeToGenre = () => {
  $("#dropdown-button").text("Genre");
  $("#texter").val("Genre");
};
const changeToYear = () => {
  $("#dropdown-button").text("Year");
  $("#texter").val("Year");
};
const changeToMinRating = () => {
  $("#dropdown-button").text("Minrating (0-5)");
  $("#texter").val("MinRating");
};

$(document).ready(() => {
  // $("#searchFormBetter").on("submit", (e) => {
  //   let searchText = $("#searchTextBetter").val();
  //   let searchOption = $("#dropdown-button").text();
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", `/movies?text=${searchText}&type=${searchOption}`, true);
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4) {
  //       code.textContent = xhr.responseText;
  //     }
  //   };
  //   xhr.send();
  //   e.preventDefault();
  // });
});
