require('dotenv').config();

// Import the Express module to create an Express application
const express = require('express');
const app = express(); // Create an instance of an Express application
const jwt = require('jsonwebtoken');

// Import the bcryptjs module for password hashing
const bcrypt = require('bcryptjs');

// Import the Mongoose model for user registration
const collection = require('./models/registers');

// Import the Path module to work with file and directory paths
const path = require('path');

// Import the Handlebars module for template rendering
const hbs = require("hbs");

// Require the database connection file to connect to MongoDB
require('./db/conn');
// Define the port to listen on, using the environment variable PORT if available, otherwise defaulting to 4000
const port = process.env.PORT || 4000;

// Define paths for static files, templates, and partials
const staticpath = path.join(__dirname, "../Public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

// Middleware to serve static files from the specified directory
app.use(express.static(staticpath));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to Handlebars and define paths for views and partials
app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);

console.log(process.env.SECRET_KEY)

// Define a route for the root URL to render the 'index' view
app.get("/", (req, res) => {
    res.render('index');
});

// Define a route for the registration URL to render the 'registration' view
app.get("/registration", (req, res) => {
    res.render('registration');
});

// Define a route for the login URL to render the 'login' view
app.get("/login", (req, res) => {
    res.render('login');
});

// Handle POST request for registration
app.post("/registration", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        // Check if passwords match
        if (password === cpassword) {
            // Create a new user instance with form data
            const student = new collection({
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                phonenumber: req.body.phonenumber,
                gender: req.body.gender
            });
            
            // console.log("student part is "+student)
            const token = await student.generateAuthToken()
            // console.log("token part is "+token)
            // Save the user to the database
            const registered = await student.save();
            res.status(201).render("index");
        } else {
            res.send("Passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// Handle POST request for login
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        const user = await collection.findOne({ email: email });
                
        // Compare the provided password with the stored hashed password
        const result = await bcrypt.compare(password, user.password);
        // console.log("start")
        const token = await user.generateAuthToken()
        // console.log(token)
        // Check if the password matches
        if (result) {
            res.status(201).render("index");
        } else {
            res.send("Invalid email or password");
        }
    } catch (error) {
        res.status(400).send(error);
        throw error;
    }
});

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
