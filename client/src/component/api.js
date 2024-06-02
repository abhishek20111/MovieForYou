import axios from 'axios';
import jwt from 'jwt-decode';

const API_KEY = '751b9ee4';


export const getData = async (imdbID) => {
  try {
    const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.log("Error in getData: ", error);
  }
};


export const getMoviesByKeyword = async (keyword) => {
  try {
    const url = `https://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${keyword}`;
    const response = await axios.get(url);
    console.log(url, response.data);
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
};


export const getMyData = async () => {
  const token = localStorage.getItem('token');
  // console.log(token);
  const { email } = jwt(token);
  try {
    const response = await axios.get(`http://localhost:8080/getMyData/${email}`)
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}

export const saveMovie = async (imdbId) => {
  const token = localStorage.getItem('token');

  const { email } = jwt(token);
  try {
    const response = await axios.put(`http://localhost:8080/addMovie`, { imdbId, email });
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}

export const removeMovie = async (imdbId) => {
  const token = localStorage.getItem('token');

  const { email } = jwt(token);
  try {
    const response = await axios.put(`http://localhost:8080/removeMovie`, { imdbId, email });
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}


export const allPeople = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/allPeople`);
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}

export const makePublic = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const { email } = jwt(token);
    const response = await axios.put(`http://localhost:8080/setpublic/${email}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}


export const makePrivate = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const { email } = jwt(token);
    const response = await axios.put(`http://localhost:8080/setprivate/${email}/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error in getMoviesByKeyword: ", error);
  }
}