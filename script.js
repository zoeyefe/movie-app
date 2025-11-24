const searchInput = document.getElementById('movie-search');
const searchBtn = document.getElementById('search-btn');
const movieGrid = document.getElementById('movie-grid');
const modal = document.getElementById('movie-modal');
const closeBtn = document.querySelector('.close-btn');

// IMPORTANT: Replace 'YOUR_API_KEY' with your actual OMDB API key.
// Get one for free at http://www.omdbapi.com/apikey.aspx
const API_KEY = 'YOUR_API_KEY'; 

// Event Listeners
searchBtn.addEventListener('click', loadMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadMovies();
});
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

async function loadMovies() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm.length === 0) return;

    if (API_KEY === 'YOUR_API_KEY' || API_KEY === '') {
        alert('Please enter your OMDB API Key in script.js!');
        return;
    }

    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovieList(data.Search);
        } else {
            movieGrid.innerHTML = `<div class="placeholder-text"><p>${data.Error}</p></div>`;
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching data.');
    }
}

function displayMovieList(movies) {
    movieGrid.innerHTML = "";
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.id = movie.imdbID;
        
        const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

        movieCard.innerHTML = `
            <div class="card-img">
                <img src="${poster}" alt="${movie.Title}">
            </div>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <span>${movie.Year}</span>
            </div>
        `;
        
        movieCard.addEventListener('click', () => {
            loadMovieDetails(movie.imdbID);
        });

        movieGrid.appendChild(movieCard);
    });
}

async function loadMovieDetails(id) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const movie = await res.json();
        
        if (movie.Response === "True") {
            displayModal(movie);
        }
    } catch (error) {
        console.error(error);
    }
}

function displayModal(movie) {
    const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";
    
    document.getElementById('modal-poster-img').src = poster;
    document.getElementById('modal-title').textContent = movie.Title;
    document.getElementById('modal-year').textContent = movie.Year;
    document.getElementById('modal-rated').textContent = movie.Rated;
    document.getElementById('modal-runtime').textContent = movie.Runtime;
    document.getElementById('modal-genre').textContent = movie.Genre;
    document.getElementById('modal-plot').textContent = movie.Plot;
    document.getElementById('modal-actors').textContent = movie.Actors;
    document.getElementById('modal-rating').textContent = movie.imdbRating;

    modal.style.display = 'block';
}
