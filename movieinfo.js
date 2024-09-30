// // https://www.omdbapi.com/?apikey=2ad0ce3b&i=tt3896198
// // https://www.omdbapi.com/?apikey=2ad0ce3b&i=${imdbID}

// const movieInfoEl = document.querySelector('.modal__info');

// // Retrieve the user ID from localStorage (this assumes the ID was previously stored)
// const imdbID = localStorage.getItem("imdbID")

// async function renderMovieInfo(imdbID) {
//   const movieInfoResponse = await fetch(`https://www.omdbapi.com/?apikey=2ad0ce3b&i=tt3896198`)
//   // console.log(movieInfoResponse)
//   const movieInfoRender = await movieInfoResponse.json();
//   // console.log(movieInfoRender)
//   movieInfoEl.innerHTML = movieInfoRender.map(info => movieInfoHTML(info)).join('')
// }

// function movieInfoHTML(info) {
//   return `<div class="modal__row modal__info">
//       <i class="fa-solid fa-xmark modal__exit click" onclick="toggleModal()"></i>
//       <h3 class="modal__title modal__title--about">${info.Title}</h3>
//       <h4 class="modal__sub-title modal__sub-title--about">Frontend Software Engineer.</h4>
//       <p class="modal__par">Over <b class="text--teal">5+ years</b> of combined <b class="text--teal">experience</b> building and maintaining websites and web applications for a variety of clients, specializing in <b class="text--teal">HTML, CSS, JavaScript, PHP, custom API, WordPress and React.</b> Proven ability to work remotely with cross-functional teams and deliver high-quality projects on <b class="text--teal">time and within scope.</b></p>
//     </div>`
// }

// // Initial rendering of posts using the ID from localStorage
// renderMovieInfo(imdbID)

// // Event handler for when the user changes the search input (assumed it's for user ID search)
// // This function will fetch and render posts for the new ID entered by the user
// async function onSearchFlix(event) {
//   // console.log('onSearchChange is working')
//   // console.log(event.target.value)
  
//   // Get the new user ID from the search input field
//   const imdbID = event.target.value

//   // Fetch and render posts for the new ID
//   renderPosts(imdbID)
// }