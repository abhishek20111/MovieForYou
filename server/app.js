const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./model/User.js')
const router = require('./router/UserRouter.js');
const Auth = require('./router/AuthRouter.js');
const dotenv = require('dotenv');
const path = require('path')
 
dotenv.config() 
 
const app = express();
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 8080; 
 
app.use(cors({ credentials: true }));
  
 
// mongoose.connect(`mongodb://localhost:27017`, { 
mongoose.connect(`mongodb+srv://miniproject:${process.env.DB_PASSWORD}@cluster0.azdxdnh.mongodb.net/?retryWrites=true&w=majority`, { 
    dbName:'AssignmentFasal'
}) 
    .then(() => {  
        console.log("Successfully connect to MongoDB");
    })
    .catch(err => {
        console.error("Connection error", err.message);
    });



app.use('/auth', Auth);
app.use('/', router);

// Serving the frontent
app.use(express.static(path.join(__dirname, 'dist')))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
    console.log(`Server is running on port - ${port}`);
})