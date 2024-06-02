import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getData, getMyData, makePrivate, makePublic } from "./api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../App.css";

function Playlist() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true); // State to manage loading
    const [change, setChange] = useState(true);
    const navigate = useNavigate();
    const notify1 = useCallback((info) => toast.success(info), []);
    const notify2 = useCallback(() => toast.info("Under Maintenance...."), []);
    const notify4 = useCallback((msg) => toast.error(msg), []);
  
    const getMyData1 = useCallback(async () => {
      try {
        const response = await getMyData();
        console.log(response.movieId);
        if (response.movieId.length > 0) {
          const movieDataPromises = response.movieId.map((item) =>
            getData(item.id).then((data) => ({
              ...data,
              public: item.public,
            }))
          );
          const moviesData = await Promise.all(movieDataPromises);
          setMovies(moviesData);
          console.log(moviesData);
          setLoading(false); // Set loading to false after data is loaded
        }else {
            setMovies([]);
            setLoading(false);
        }
      } catch (error) {
        notify4("Error fetching data");
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      }
    }, [notify4]);
  
    const makePriva = useCallback(async (id) => {
      try {
        console.log(id);
        const response = await makePrivate(id);
        console.log(response.user);
        notify1(response.message);
        setChange((prevChange) => !prevChange);
      } catch (error) {
        notify4("Error updating movie status");
        console.error(error);
      }
    }, [notify1, notify4]);
  
    const makePubli = useCallback(async (id) => {
      try {
        console.log(id);
        const response = await makePublic(id);
        console.log(response.user);
        notify1(response.message);
        setChange((prevChange) => !prevChange);
      } catch (error) {
        notify4("Error updating movie status");
        console.error(error);
      }
    }, [notify1, notify4]);
  
    const publicMovies = useMemo(() => movies.filter((movie) => movie.public), [movies]);
    const privateMovies = useMemo(() => movies.filter((movie) => !movie.public), [movies]);
  
    useEffect(() => {
      getMyData1();
    }, [change, getMyData1]);

  return (
    <div className="h-screen w-[99vw] text-white bg-[#181818]">
       {loading && <div class="loader"></div>}
      <div className="pt-12 sm:flex-row flex justify-between flex-col w-full">
        <div className="w-full justify-center">
          <h1 className="text-center text-2xl font-semibold">Public</h1>
          <div className="flex flex-wrap gap-6 m-4 shadow-xl overflow-auto h-[70dvh] custom-scrollbar">
            {publicMovies.map((movie) => (
              <div
                key={movie.imdbID}
                className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer"
              >
                <a className="block relative h-48 rounded overflow-hidden">
                  <img
                    alt="movie"
                    className="object-cover object-center w-full h-full block"
                    src={movie.Poster !== "N/A" ? movie.Poster : "Image"}
                  />
                </a>
                <div className="mt-4 flex justify-between items-center">
                  <h2
                    onClick={() => navigate("/open", { state: { movie } })}
                    className="text-white title-font text-lg font-medium"
                  >
                    {movie.Title}
                  </h2>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={movie.public}
                      onChange={() => makePriva(movie.imdbID)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full justify-center">
          <h1 className="text-2xl font-semibold text-center">Private</h1>
          <div className="flex flex-wrap gap-6 m-4 overflow-auto h-[70dvh] shadow-xl custom-scrollbar">
            {privateMovies.map((movie) => (
              <div
                key={movie.imdbID}
                className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer"
              >
                <a className="block relative h-48 rounded overflow-hidden">
                  <img
                    alt="movie"
                    className="object-cover object-center w-full h-full block"
                    src={movie.Poster !== "N/A" ? movie.Poster : "Image"}
                  />
                </a>
                <div className="mt-4 flex justify-between items-center">
                  <h2
                    onClick={() => navigate("/open", { state: { movie } })}
                    className="text-white title-font text-lg font-medium"
                  >
                    {movie.Title}
                  </h2>

                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={movie.public}
                      onChange={() => makePubli(movie.imdbID)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
