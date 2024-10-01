// https://www.omdbapi.com/?apikey=2ad0ce3b&i=tt3896198
// https://www.omdbapi.com/?apikey=2ad0ce3b&i=${imdbID}
// https://www.omdbapi.com/?apikey=2ad0ce3b&s=everything

let flixData;  // Declare flixData globally to store fetched movie data
let currentQuery = 'everything';  // Declare a global variable to store the current search query
let isModalOpen = false;  // Global variable to track the state of the modal (open or closed)

// Load default movie list when the page loads
window.addEventListener('DOMContentLoaded', () => {
  flixInfo();  // Load the default "everything" movies when the page loads
});

// Select the element where the search results will be rendered
const flixListEl = document.querySelector('.flix-list');
const modalEl = document.querySelector('.modal');  // Modal element for displaying movie info
const modalInfoEl = document.querySelector('.modal__info');  // Container within the modal to display movie details

// Retrieve the user ID from localStorage (this assumes the ID was previously stored)
const imdbID = localStorage.getItem("imdbID");

// Function to fetch and render flix information based on search query
async function flixInfo(query = currentQuery, filter) {
  // Update the current query with the provided query value
  currentQuery = query;

  // Add a 'flix__loading' class to the wrapper to indicate loading
  flixListEl.classList += ' flix__loading';

  try {
    // Fetch movies based on the search query
    const response = await fetch(`https://www.omdbapi.com/?apikey=2ad0ce3b&s=${query}`);
    // console.log(response)
    const flixData = await response.json();  // Convert the response to JSON
    // console.log(flixData)
    
    // Check if the response contains valid search results
    if (flixData.Response === "True") {
      // Sorting logic based on the provided filter
      if (filter === 'LATEST_TO_EARLIEST') {
        // Sort by year in descending order (latest to earliest)
        flixData.Search.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      } else if (filter === 'EARLIEST_TO_LATEST') {
        // Sort by year in ascending order (earliest to latest)
        flixData.Search.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      }
      // Limit the results to 6 movies only
      const limitedResults = flixData.Search.slice(0, 6);
      // flixListEl.innerHTML = flixData.Search.map((movie) => flexHTML(movie)).join('')

      // Render the search results dynamically
      flixListEl.innerHTML = limitedResults.map((movie) => flexHTML(movie)).join('');
      
      // Add click event listener to each movie element to open the modal with movie details
      document.querySelectorAll('.flix').forEach(item => {
        item.addEventListener('click', () => showMovieInfo(item.dataset.imdbid));  // Pass imdbID when clicked
      });
    } else {
      // If no results, display a message
      flixListEl.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (error) {
    // Handle any errors during the fetch process
    console.error("Error fetching movie data:", error);
    flixListEl.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
  } finally {
    // Remove the 'flix__loading' class once movies are loaded to stop the loading indication
    flixListEl.classList.remove('flix__loading');
  }
}

// Function to create the HTML structure for each movie
function flexHTML(movie) {
  return `<div class="flix" data-imdbid="${movie.imdbID}">  <!-- Store imdbID in data attribute for later use -->
            <div class="flix__img--wrapper">
              <img src="${movie.Poster}" alt="Movie Poster" class="flix_img">
            </div>
            <div class="flix__content">
              <h3 class="flix__title">${movie.Title}</h3>
              <h4 class="flix__year">${movie.Year}</h4>
              <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">
                <i class="fa-brands fa-imdb imdb__logo"></i>
              </a>
            </div>
          </div>`;
}

// Event handler for the search input field
async function onSearchFlix(event) {
  const query = event.target.value.trim();  // Get the search input value and remove extra spaces

  // Only perform search if the query is not empty
  if (query.length > 0) {
    flixInfo(query);  // Perform search with the entered query
  } else {
    // Clear the results if the search field is cleared
    flixListEl.innerHTML = "";
  }
  // console.log(event);
}

// A function to handle filtering movie years based on user input from an event (e.g., a dropdown change)
function filterYears(event) {
  const filter = event.target.value;  // Get the selected filter value (e.g., 'LATEST_TO_EARLIEST' or 'EARLIEST_TO_LATEST')

  // Pass the selected filter value to the flixInfo function to apply sorting
  flixInfo(currentQuery, filter);
  // console.log(event);
}

// Global error handler
window.onerror = function () {
  alert('Contact feature has not been implemented');
}

// Function to show movie details in the modal
async function showMovieInfo(imdbID) {
  // console.log("Fetching movie details for IMDb ID:", imdbID);  // Log the IMDb ID for debugging
  try {
    const movieResponse = await fetch(`https://www.omdbapi.com/?apikey=2ad0ce3b&i=${imdbID}`);
    // console.log(movieResponse)
    const movieData = await movieResponse.json();  // Convert the response to JSON
    // console.log(movieData);  // Log movie data for debugging

    if (movieData.Response === "True") {
      // Render the movie details in the modal
      modalInfoEl.innerHTML = movieInfoHTML(movieData);  // Use movieInfoHTML to generate the modal content
      // modalInfoEl.innerHTML = movieInfoHTML(movieInfos)).join('')
      // modalInfoEl.innerHTML = movieData.map((moviesInfo) => movieInfoHTML(moviesInfo)).join('')
      toggleModal();  // Open the modal
    } else {
      // If no movie details are found, display an error message in the modal
      modalInfoEl.innerHTML = `<p>Movie details not found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching movie info:", error);  // Log any errors that occur during the fetch process
  }
}

// Function to create the HTML structure for the movie details in the modal
function movieInfoHTML(moviesInfo) {
  const imdbColorClass = getRatingColorClass(moviesInfo.imdbRating, 'imdb');  // Get color class for IMDb rating
  const metascoreColorClass = getRatingColorClass(moviesInfo.Metascore, 'meta');  // Get color class for Metascore

  return `
    <i class="fa-solid fa-xmark modal__exit click" onclick="toggleModal()"></i>
    <h3 class="modal__title">${moviesInfo.Title}</h3>
    <p class="modal__par"><b>Year:</b>&nbsp ${moviesInfo.Year}</p>
    <p class="modal__par"><b>Genre:</b>&nbsp ${moviesInfo.Genre}</p>
    <p class="modal__par"><b>Plot:</b> ${moviesInfo.Plot}</p>
    <div class="ratings__wrapper">
      <div class="rating">
        <h4>IMDB</h4>
        <h5>Rating:</h5>
        <span class="${imdbColorClass}">&nbsp${moviesInfo.imdbRating}</span>  <!-- Apply IMDb color class -->
      </div>
      <div class="rating">
        <h4>Metascore</h4>
        <h5>Rating:</h5>
        <span class="${metascoreColorClass}">&nbsp${moviesInfo.Metascore}</span>  <!-- Apply Metascore color class -->
      </div>
    </div>
    <img src="${moviesInfo.Poster}" alt="${moviesInfo.Title}" class="modal__img">
  `;
}

// Function to determine the color class based on rating value
function getRatingColorClass(rating, type) {
  if (type === 'imdb') {
    rating = parseFloat(rating);  // Convert imdbRating to a float for comparison
    if (rating <= 5.0) return 'rating-red';  // Red for ratings <= 5.0
    if (rating <= 7.0) return 'rating-yellow';  // Yellow for ratings <= 7.0
    if (rating >= 7.1) return 'rating-green';  // Green for ratings >= 8.0
  } else if (type === 'meta') {
    rating = parseInt(rating);  // Convert Metascore to an integer for comparison
    if (rating <= 50) return 'rating-red';  // Red for Metascore <= 50
    if (rating <= 70) return 'rating-yellow';  // Yellow for Metascore <= 70
    if (rating >= 71) return 'rating-green';  // Green for Metascore >= 80
  }
  return '';  // Default: No color class
}


// Function to toggle modal visibility
function toggleModal() {
  isModalOpen = !isModalOpen;  // Toggle the modal's state
  if (isModalOpen) {
    modalEl.style.display = 'flex';  // Show the modal when isModalOpen is true
  } else {
    modalEl.style.display = 'none';  // Hide the modal when isModalOpen is false
  }
}

// --- WIP ---

// function ratingColors(imdbRating, Metascore) {
//   if (imdbRating >= 8.0) {
//     return `<h5>Rating:</hr><span class="rating__green">&nbsp${imdbRating}</span>`
//   } 
// }