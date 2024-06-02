import React, { useEffect, useState, useCallback } from 'react';
import { allPeople, getData } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../App.css'

function People() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLogin = localStorage.getItem('token');

  const navigator = useNavigate();

  const getUserData = useCallback(async () => {
    try {
      const response = await allPeople();
      const usersWithPublicMovies = response.filter(user => 
        user.movieId.some(item => item.public)
      ).map(async user => {
        const movieDataPromises = user.movieId.map(async item => {
          if (item.public) {
            const data = await getData(item.id);
            return { ...data, public: item.public };
          }
          return null;
        });
        const moviesData = await Promise.all(movieDataPromises);
        const filteredMovies = moviesData.filter(movie => movie !== null);
        return { ...user, movies: filteredMovies };
      });
      const usersWithData = await Promise.all(usersWithPublicMovies);
      setUserData(usersWithData);
      setLoading(false); // Set loading to false after data is loaded
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch user data.');
      setLoading(false); // Set loading to false in case of error
    }
  }, []);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <div className="h-[90dvh] text-white w-[99vw] bg-[#181818] overflow-x-auto">
      {loading && <div class="loader"></div>} 
      <h1 className="text-2xl p-3 font-semibold">Check Out Other Playlists</h1>
      <div className="divide-y-2 divide-slate-100 p-4 flex flex-col flex-wrap overflow-y-auto w-full custom-scrollbar">
        {userData.map(data => (
          <div key={data._id} className="flex flex-col p-4 items-center gap-4 ">
            <div className="flex items-center w-full">
              <div className="ml-2 cursor-pointer">
                <h1 className="text-xl">{data.name}</h1>
                <p className="text-sm">{data.email}</p>
              </div>
            </div>
            <div className="flex gap-6 m-4 shadow-xl w-full flex-wrap overflow-y-auto custom-scrollbar">
              {data.movies.map(movie => (
                <div
                  key={movie.imdbID}
                  className="h-[300px] w-[200px] p-2 cursor-pointer"
                  onClick={() => {
                    isLogin ? navigator('/open', { state: { movie } }) : navigator('/login');
                  }}
                >
                  <a className="block relative h-48 rounded overflow-hidden">
                    <img
                      alt="movie"
                      className="object-cover object-center w-full h-full block"
                      src={loading ? '/placeholder.jpg' : (movie.Poster !== 'N/A' ? movie.Poster : 'Image')}
                    />
                  </a>
                  <div className="mt-4">
                    <h2 className="text-white title-font text-lg font-medium">{movie.Title}</h2>
                    <div className="flex w-full justify-between items-center">
                      <p className="mt-1 text-white">{movie.Year}</p>
                      <h3 className="text-white text-xs tracking-widest title-font mb-1">imdb: {movie.imdbRating}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default People;
