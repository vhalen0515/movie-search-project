const searchResultsContainer = document.getElementById(
  "search-results-container"
);
const removeBtn = document.getElementById("remove-icon");
const clearAllBtn = document.getElementById("clear-all-btn");
let movieWatchlist = [];

document.addEventListener("DOMContentLoaded", function () {
  let watchlistStorageItems = JSON.parse(
    localStorage.getItem("movieWatchlist")
  );

  if (watchlistStorageItems.length > 0) {
    movieWatchlist = watchlistStorageItems;
    renderMovies();
  } else {
    renderPlaceholderContent();
  }

  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "remove-icon") {
      const movieContainer = event.target.closest("#movie-container");
      const index = Array.from(movieContainer.parentNode.children).indexOf(
        movieContainer
      );

      movieWatchlist.splice(index, 1);

      localStorage.setItem("movieWatchlist", JSON.stringify(movieWatchlist));

      movieContainer.remove();

      if (movieWatchlist.length === 0) {
        renderPlaceholderContent();
      }
    }
  });
});

function renderMovies() {
  searchResultsContainer.innerHTML = "";

  movieWatchlist.forEach(function (movie) {
    searchResultsContainer.innerHTML += `
        <div id="movie-container">
            <div id="movie-poster-container">
                <img id="movie-poster" src="${movie.poster}" />
            </div>
            <div class="movie-info-container">
                <div class="title-line">
                    <h3>${movie.title}</h3>
                    <img id="star-img" src="images/star_icon2.svg" />
                    <p>${movie.rating}</p>
                </div>
                <div class="details-line">
                    <p>${movie.runtime}</p>
                    <p>${movie.genre}</p>
                    <div class="watchlist-btn-text">
                        <img id="remove-icon" src="images/remove_icon.svg" />
                        <p>Watchlist</p>
                    </div>
                </div>
                <div class="movie-summary">
                    <p>${movie.plot}</p>
                </div>
            </div>
        </div>
        `;
  });
}

function renderPlaceholderContent() {
  searchResultsContainer.innerHTML = `
    <div id="placeholder-container">
        <h4>Your 'Watchlist' is looking a little empty...</h4>
        <div id="add-movies-container">
            <a href="index.html">
                <img id="add-icon" src="images/add_icon.svg" />
            </a>
            <h4 id="add-movies-text">Let's add some movies!</h4>
        </div>
    </div>
    `;
}

clearAllBtn.addEventListener("click", function () {
  localStorage.clear();
  renderPlaceholderContent();
});
