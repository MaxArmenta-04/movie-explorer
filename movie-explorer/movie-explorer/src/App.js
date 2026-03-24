import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_KEY = '9897eea6fc4976337979ffd8c1e477d3';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">No Image</div>
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-meta">Release Date: {movie.release_date || 'N/A'}</p>
        <p className="movie-meta">Rating: {movie.vote_average ? movie.vote_average.toFixed(3) : 'N/A'}</p>
      </div>
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = useCallback(async (query, page) => {
    setLoading(true);
    try {
      let url;
      if (query) {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      } else {
        url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMovies(searchQuery, currentPage);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, fetchMovies]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const getSortedMovies = () => {
    if (!sortBy) return movies;
    const sorted = [...movies];
    if (sortBy === 'date_asc') {
      sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else if (sortBy === 'date_desc') {
      sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'rating_asc') {
      sorted.sort((a, b) => a.vote_average - b.vote_average);
    } else if (sortBy === 'rating_desc') {
      sorted.sort((a, b) => b.vote_average - a.vote_average);
    }
    return sorted;
  };

  const displayedMovies = getSortedMovies();

  return (
    <div className="app">
      <header className="header">
        <h1>Movie Explorer</h1>
        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <select className="sort-select" value={sortBy} onChange={handleSort}>
            <option value="">Sort By</option>
            <option value="date_asc">Release Date (Asc)</option>
            <option value="date_desc">Release Date (Desc)</option>
            <option value="rating_asc">Rating (Asc)</option>
            <option value="rating_desc">Rating (Desc)</option>
          </select>
        </div>
      </header>

      <main className="main">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="movie-grid">
            {displayedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
            {displayedMovies.length === 0 && (
              <div className="no-results">No movies found.</div>
            )}
          </div>
        )}
      </main>

      <footer className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-number">Page {currentPage}</span>
        <button
          className="page-btn"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </footer>
    </div>
  );
}

export default App;
