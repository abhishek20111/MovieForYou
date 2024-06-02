import React, { useEffect, useState, useCallback } from 'react';
import { getData, getMoviesByKeyword } from './api';
import '../App.css';
import Image from '../assests/images.png';
import { useLocation, useNavigate } from 'react-router-dom';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const moviesPerPage = 10;
  const navigator = useNavigate();
  const isLogin = localStorage.getItem('token');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      const movieIds = [
        'tt7288562', 'tt2417628', 'tt1470849', 'tt0422946', 'tt3896198',
        'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083', 'tt0108052',
        'tt0167260', 'tt0110912', 'tt0060196', 'tt0120737', 'tt0137523'
      ];

      try {
        const movieDataPromises = movieIds.map(id => getData(id));
        const moviesData = await Promise.all(movieDataPromises);
        setMovies(moviesData);
        setFilteredMovies(moviesData);
      } catch (error) {
        setError('Failed to fetch initial movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Calculate the current movies to display
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearch = async (term) => {
    setLoading(true);
    setError(null);
    if (term) {
      const searchResult = await getMoviesByKeyword(term);
      if (searchResult && searchResult.Response === "True") {
        setFilteredMovies(searchResult.Search);
        console.log(searchResult.Search);
        const moviId = searchResult.Search.length>0 && searchResult.Search.map((item)=>item.imdbID);
        console.log(moviId);
        const movieDataPromises = moviId.map(id => getData(id));
        const moviesData = await Promise.all(movieDataPromises);
        setMovies(moviesData);
        setFilteredMovies(moviesData);
        setCurrentPage(1);
      } else {
        setFilteredMovies([]);
        setError(searchResult.Error+' Search another keyword' || 'Something went wrong. Please try again.');
      }
    } else {
      setFilteredMovies(movies);
    }
    setLoading(false);
  };

  const debounceSearch = useCallback(debounce(handleSearch, 2000), [movies]);

  return (
    <div className='h-screen bg-[#181818]'>
      <section className="text-gray-600 body-font custom-scrollbar h-full">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl sm:block hidden text-white">Movie Library</h1>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className="px-4 py-2 rounded-l-lg"
              />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-lg" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap -m-4">
                {console.log(currentMovies)}
                {currentMovies.map(movie => (
                  <div key={movie.imdbID} className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer" 
                  onClick={() => {
                    isLogin ? navigator('/open', { state: { movie } }) : navigator('/login');
                  }}>
                  
                    <a className="block relative h-48 rounded overflow-hidden">
                      <img alt="movie" className="object-cover object-center w-full h-full block" src={movie.Poster !== 'N/A' ? movie.Poster : Image} />
                    </a>
                    <div className="mt-4">
                        {/* {console.log(movie)} */}
                      <h2 className="text-white title-font text-lg font-medium">{movie.Title}</h2>
                      <div className='flex w-full justify-between items-center'>
                      <p className="mt-1 text-white">{movie.Year}</p>
                      <h3 className="text-white text-xs tracking-widest title-font mb-1">imdb: {movie.imdbRating}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 rounded-lg py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
