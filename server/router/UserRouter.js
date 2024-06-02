const express = require('express')
const router = express.Router()

const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get("/getMyData/:email", async (req, res) => {
    console.log("getMyData");
    try {
        const oldUser = await User.findOne({ email: req.params.email }).select('-password').exec();

        if (!oldUser) {
            return res.json({ error: "User Not Exists" });
        }
        return res.status(200).json(oldUser);
    } catch (error) {
        res.status(400).send({ error });
    }
});


router.put("/addMovie", async (req, res) => {
    console.log("addMovie");
    const { imdbId, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const movieExists = user.movieId.some(movie => movie.id === imdbId);
        if (movieExists) {
            return res.status(409).send({ error: 'Movie already added' });
        }

        user.movieId.push({ id: imdbId });
        await user.save();

        res.status(200).send({ message: 'Movie added successfully', user });
    } catch (error) {
        console.error('Error in addMovie:', error);
        res.status(500).send({ error: 'An error occurred while adding the movie' });
    }
});


router.put('/removeMovie', async (req, res) => {
    console.log('removeMovie', req.body);
    const { imdbId, email } = req.body;

    if (!imdbId || !email) {
        return res.status(400).send({ error: 'Both imdbId and email are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const movieIndex = user.movieId.findIndex(movie => movie.id === imdbId);
        if (movieIndex === -1) {
            return res.status(404).send({ error: 'Movie not found in user\'s list' });
        }

        user.movieId.splice(movieIndex, 1);
        await user.save();

        res.status(200).send({ message: 'Movie removed successfully', user });
    } catch (error) {
        console.error('Error in removeMovie:', error);
        res.status(500).send({ error: 'An error occurred while removing the movie' });
    }
});


router.get('/allPeople', async(req, res)=>{
    console.log('allpeople');
    try{
        const response = await User.find().select('-password').exec();
        return res.status(200).send(response);
    }catch(error){
        console.log("Error in getMoviesByKeyword: ", error);
        res.status(500).send({error: "An error occurred while fetching the movies" });
    }
})

router.put('/setpublic/:email/:id', async (req, res) => {
    console.log("setpublic");
    const { email, id } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const movie = user.movieId.find(movie => movie.id === id);
        if (!movie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        if (movie.public) {
            return res.status(400).send({ error: 'Movie is already public' });
        }

        movie.public = true;
        await user.save();

        res.status(200).send({ message: 'Movie is now public', user });
    } catch (error) {
        console.log("Error in setpublic: ", error);
        res.status(500).send({ error: "An error occurred while updating the movie" });
    }
});

router.put('/setprivate/:email/:id', async (req, res) => {
    console.log("setprivate");
    const { email, id } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const movie = user.movieId.find(movie => movie.id === id);
        if (!movie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        if (!movie.public) {
            return res.status(400).send({ error: 'Movie is already private' });
        }

        movie.public = false;
        await user.save();

        res.status(200).send({ message: 'Movie is now private', user });
    } catch (error) {
        console.log("Error in setprivate: ", error);
        res.status(500).send({ error: "An error occurred while updating the movie" });
    }
});



module.exports = router;