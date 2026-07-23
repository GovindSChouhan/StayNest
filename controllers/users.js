// =====================================================
// controllers/users.js
//
// User Controller
//
// Purpose:
// Contains all business logic related to Users.
//
// Responsibilities:
// • Render Signup page
// • Register a new user
// • Render Login page
// • Login user
// • Logout user
// • Redirect users
// • Show flash messages
//
// This file DOES NOT define routes.
//
// Routes are defined in:
//
// routes/user_mvc.js
//
// Why use a Controller?
// Instead of writing authentication logic inside
// route files, we move it here to keep routes
// clean, reusable and easier to maintain.
//
// MVC Flow:
//
// Browser Request
//        ↓
// routes/user_mvc.js
//        ↓
// controllers/users.js
//        ↓
// models/user.js
//        ↓
// MongoDB
//        ↓
// Redirect / Response
// =====================================================

// Import User Model
// Used for Signup and Authentication.
const User = require("../models/user.js");


// =====================================================
// Render Signup Page
// GET /signup
// =====================================================
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


// =====================================================
// Signup User
// POST /signup
//
// Creates a new user and automatically logs them in.
// =====================================================
module.exports.signup = async (req, res, next) => {

    try {

        let { username, email, password } = req.body;

        // Create a new User object
        const newUser = new User({
            email,
            username,
        });

        // Register the user
        // passport-local-mongoose automatically:
        // • hashes the password
        // • stores the hashed password
        const registeredUser = await User.register(newUser, password);

        // console.log(registeredUser);
        // Used only for debugging.

        // Automatically log the user in after successful signup.
        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to StayNest!");

            res.redirect("/listings");
        });

    }

    catch (e) {

        req.flash("error", e.message);

        res.redirect("/signup");
    }

};


// =====================================================
// Render Login Page
// GET /login
// =====================================================
module.exports.renderLoginForm = (req, res) => {

    res.render("users/login.ejs");

};


// =====================================================
// Login User
//
// Passport has already authenticated the user.
// This controller only handles flash message
// and redirection.
// =====================================================
module.exports.login = (req, res) => {

    console.log("LOGIN SUCCESS");
    console.log(req.user);

    // Success flash message
    req.flash("success", "Welcome back to StayNest!");

    // If user originally requested a protected route,
    // redirect there after login.
    // Otherwise redirect to Listings page.
    let redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);

};


// =====================================================
// Logout User
// GET /logout
// =====================================================
module.exports.logout = (req, res, next) => {

    // Passport removes the user's login session.
    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");

        res.redirect("/listings");

    });

};