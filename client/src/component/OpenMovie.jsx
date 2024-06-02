import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Image from "../assests/images.png";
import NotSave from "../assests/notsave.png";
import Save from "../assests/save.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../App.css";
import { getMyData, removeMovie, saveMovie } from "./api";

function OpenMovie() {
  const location = useLocation();
  const movie = location.state.movie;
  console.log(movie);
  const [save, setSave] = useState(false);
  const [debounceValue, setDebounceValue] = useState(true);
  const notify1 = (info) => toast.success(info);

  const debouncing = (delay, id) => {
    if (debounceValue) {
      setDebounceValue(false);
      setTimeout(() => {
        handleSave(id);
        setDebounceValue(true);
      }, delay);
    }
  };


  const handleSave = async ( id) => {
    // e.preventDefault();
    if (save) {
      const response = await removeMovie(id);
      setSave(false);
      notify1('Removed from playlist');
    } else {
      const response = await saveMovie(id);
      setSave(true);
      notify1('Saved to playlist');
    }
  };

  
  const getMyData1 = async () => {
    const data = await getMyData();
    console.log(data);
    data.movieId.length > 0 && data.movieId.forEach((item) => {
      if (item.id === movie.imdbID) {
        setSave(true);
      }
    });
  };

  useEffect(() => {
    getMyData1();
  }, [movie]);

  return (
    <div className="h-screen w-[99vw] text-white bg-[#181818] flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 flex justify-center items-center bg-gray-900">
        <img
          className="object-contain max-h-full max-w-full"
          src={movie.Poster !== "N/A" ? movie.Poster : Image}
          alt={movie.Title}
        />
      </div>
      <div className="w-full sm:w-1/2 overflow-auto flex flex-col p-4 space-y-4 custom-scrollbar">
        <div className="flex justify-between ">
          <h1 className="text-3xl font-bold">{movie.Title}</h1>
          <div onClick={() => debouncing(1000, movie.imdbID)}>
            {save ? (
              <img
                src={Save}
                className="h-12 cursor-pointer hover:bg-slate-700 rounded-full mr-16"
                alt=""
              />
            ) : (
              <img
                src={NotSave}
                className="h-12 cursor-pointer hover:bg-slate-700 rounded-full mr-16"
                alt=""
              />
            )}
          </div>
        </div>
        <p><span className="font-semibold">Rated:</span> {movie.Rated}</p>
        <p><span className="font-semibold">Released:</span> {movie.Released}</p>
        <p><span className="font-semibold">Year:</span> {movie.Year}</p>
        <p><span className="font-semibold">Runtime:</span> {movie.Runtime}</p>
        <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
        <p><span className="font-semibold">Director:</span> {movie.Director}</p>
        <p><span className="font-semibold">Writer:</span> {movie.Writer}</p>
        <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
        <p><span className="font-semibold">Plot:</span> {movie.Plot}</p>
        <p><span className="font-semibold">Language:</span> {movie.Language}</p>
        <p><span className="font-semibold">Country:</span> {movie.Country}</p>
        <p><span className="font-semibold">Awards:</span> {movie.Awards}</p>
        <p><span className="font-semibold">Box Office:</span> {movie.BoxOffice}</p>
        <p><span className="font-semibold">Metascore:</span> {movie.Metascore}</p>
        <p><span className="font-semibold">IMDb Rating:</span> {movie.imdbRating}</p>
        <p><span className="font-semibold">IMDb Votes:</span> {movie.imdbVotes}</p>
        <p className="font-semibold">Ratings:</p>
        <ul className="list-disc list-inside">
          {movie.Ratings.map((rating, index) => (
            <li key={index}>
              {rating.Source}: {rating.Value}
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

export default OpenMovie;
