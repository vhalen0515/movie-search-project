const searchResultsContainer = document.getElementById(
  "search-results-container"
);
const addBtn = document.getElementById("add-img");
const removeBtn = document.getElementById("remove-icon");
const searchInput = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const filmIconContainer = document.getElementById("film-icon-container");
const popupContainer = document.getElementById("popup-container");
let movieWatchlist = [];
popupStates = {};

document.addEventListener("DOMContentLoaded", function () {
  const storedMovies = JSON.parse(localStorage.getItem("movieWatchlist")) || [];
  movieWatchlist = storedMovies;
});

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", function () {
  filmIconContainer.style.display = "none";

  const searchInputValue = searchInput.value;
  renderSearchResults(searchInputValue);
});

function renderSearchResults(searchInputValue) {
  fetch(
    `https://www.omdbapi.com/?apikey=3b14e358&s=${searchInputValue}&type=movie`
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.Search) {
        return (searchResultsContainer.innerHTML = `
            <div id="no-results-message">
                <h4>Oops...We can't find what you're looking for.  Please try another search!</h4>
            </div>
            `);
      } else {
        searchResultsContainer.innerHTML = "";
      }

      data.Search.forEach((movie) => {
        fetch(
          `http://www.omdbapi.com/?apikey=3b14e358&t=${movie.Title}&type=movie`
        )
          .then((res) => res.json())
          .then((movieDetails) => {
            const movieId = movieDetails.Title.replace(
              /\s+/g,
              "-"
            ).toLowerCase();
            const isInWatchlist = movieWatchlist.some(
              (watchedMovie) => watchedMovie.title === movieDetails.Title
            );
            const cursorStyle = isInWatchlist ? "default" : "pointer";

            searchResultsContainer.innerHTML += `
                <div id="movie-container">
                    <div id="movie-poster-container">
                        <img id="movie-poster" src="${movieDetails.Poster}" />
                    </div>
                    <div class="movie-info-container">
                        <div class="title-line">
                            <h3>${movieDetails.Title}</h3>
                            <h3>(${movieDetails.Year})</h3>
                            <img id="star-img" src="images/star_icon2.svg" />
                            <p>${movieDetails.imdbRating}</p>
                        </div>
                        <div class="details-line">
                            <p>${movieDetails.Runtime}</p>
                            <p>${movieDetails.Genre}</p>
                            <div class="watchlist-btn-text">
                                <img class="add-img" data-movie="${movieId}" src="${
              isInWatchlist ? "images/checkmark.svg" : "images/add_icon.svg"
            }" style="cursor: ${cursorStyle}" />
                                <p>Watchlist</p>
                            </div>
                        </div>
                        <div class="movie-summary">
                            <p>${movieDetails.Plot}</p>
                        </div>
                    </div>
                </div>
                `;
          });
      });
    });
}

document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("add-img")) {
    const movieContainer = event.target.closest("#movie-container");
    const addIcon = event.target;

    if (movieContainer) {
      const movieTitleAndYear =
        movieContainer.querySelector(".title-line h3").textContent;
      const movieId = addIcon.getAttribute("data-movie");
      const movieAlreadyExists = movieWatchlist.some(
        (movie) => movie.title === movieTitleAndYear
      );

      if (!movieAlreadyExists) {
        const movieRating =
          movieContainer.querySelector(".title-line p").textContent;
        const movieRuntime = movieContainer.querySelector(
          ".details-line p:nth-child(1)"
        ).textContent;
        const movieGenre = movieContainer.querySelector(
          ".details-line p:nth-child(2)"
        ).textContent;
        const moviePoster = movieContainer.querySelector("#movie-poster").src;
        const moviePlot =
          movieContainer.querySelector(".movie-summary p").textContent;

        const movie = {
          title: movieTitleAndYear,
          rating: movieRating,
          runtime: movieRuntime,
          genre: movieGenre,
          poster: moviePoster,
          plot: moviePlot,
        };

        movieWatchlist.push(movie);
        localStorage.setItem("movieWatchlist", JSON.stringify(movieWatchlist));
        changeIcon(addIcon);
        addIcon.disabled = true;
        addIcon.style.cursor = "default";

        const moviePopupShown = popupStates[movieId];
        if (!moviePopupShown) {
          showPopupMessage();
          popupStates[movieId] = true;
        }
      }
    }
  }
});

function changeIcon(addIcon) {
  if (addIcon.src.match("add_icon.svg")) {
    addIcon.src = "images/checkmark.svg";
  }
}

function showPopupMessage() {
  popupContainer.classList.add("show");
  setTimeout(function () {
    popupContainer.classList.remove("show");
  }, 1500);
}
