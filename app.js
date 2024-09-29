// https://www.omdbapi.com/?apikey=2ad0ce3b&i=tt3896198
// https://www.omdbapi.com/?apikey=2ad0ce3b&s=everything

let flixData;  // Declare flixData globally to store fetched movie data

// Load default movie list when the page loads
window.addEventListener('DOMContentLoaded', () => {
  flixInfo()  // Load the default "everything" movies when the page loads
});

// Select the element where the search results will be rendered
const flixListEl = document.querySelector('.flix-list');

// Display movies prior to search
async function flixShowMovies() {
  const priorResponse = await fetch(`https://www.omdbapi.com/?apikey=2ad0ce3b&s=everything`);
  // console.log(priorResponse)
  const flixPriorSearch = await priorResponse.json();
  // console.log(flixPriorSearch)
  flixListEl.innerHTML = flixPriorSearch.Search.map((movie) => flexHTML(movie)).join('');
  // flixListEl.innerHTML = flixData.Search.map((movie) => flexHTML(movie)).join('')
}

// Function to fetch and render flix information based on search query and filter
async function flixInfo(query = 'everything', filter) {
  // Add a 'flix__loading' class to the wrapper to indicate loading.
  flixListEl.classList.add('flix__loading');

  try {
    // Fetch movies based on the search query
    const response = await fetch(`https://www.omdbapi.com/?apikey=2ad0ce3b&s=${query}`);
    // console.log(response)
    flixData = await response.json();  // Store fetched data in flixData
    // console.log(flixData)

    // Check if the response contains valid search results
    if (flixData.Response === "True") {
      // Apply sorting based on the selected filter
      if (filter === 'LATEST_TO_EARLIEST') {
        flixData.Search.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      } else if (filter === 'EARLIEST_TO_LATEST') {
        flixData.Search.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      }

      // Limit the results to 6 movies only
      const limitedResults = flixData.Search.slice(0, 6);

      // Render the sorted/filtered search results dynamically
      flixListEl.innerHTML = limitedResults.map((movie) => flexHTML(movie)).join('');
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
  return `<div class="flix">
          <div class="flix__img--wrapper">
            <img src="${movie.Poster}" alt="Movie Poster" class="flix_img">
          </div>
          <div class="flix__content">
           <h3>${movie.Title}</h3>
           <h4>${movie.Year}</h4>
           <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank">
             <i class="fa-brands fa-imdb imdb__logo"></i>
           </a>
          </div>
        </div>`;
}

// Event handler for the search input field
async function onSearchFlix(event) {
  const query = event.target.value.trim();

  // Only perform search if the query is not empty
  if (query.length > 0) {
    flixInfo(query);
  } else {
    // Clear the results if the search field is cleared
    flixListEl.innerHTML = "";
    // console.log(event)
  }
}

// Function to handle sorting by year (Earliest to Latest or Latest to Earliest)
function filterYears(event) {
  const filter = event.target.value;  // Get the selected filter value
  // console.log(event)

  // Pass the current filter option to the flixInfo function
  flixInfo('everything', filter);
}