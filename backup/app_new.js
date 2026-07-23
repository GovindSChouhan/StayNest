console.log("🔥 I AM RUNNING APP_NEW.JS");

// =====================================================
// Required Packages
// =====================================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//require Express Session
const session = require("express-session");
//require FLASH
const flash = require("connect-flash");
// Import Passport (Authentication Manager)
const passport = require("passport");
// Import Local Strategy (Username + Password Authentication)
const LocalStrategy = require("passport-local");
// Import User Model (Contains authenticate(), register(), etc.)
const User = require("../models/user.js");

//for signup user user.js
const listingRouter = require("../routes/listing.js"); // FIXED: was wrongly pointing to user.js
const reviewRouter = require("../routes/review.js");
const userRouter = require("../routes/user.js");


// =====================================================
// Utilities
// =====================================================
const ExpressError = require("../utils/ExpressError.js");

// =====================================================
// Express Routers
// =====================================================
// "Go to routes/listing.js, get the exported Router,
// and store it inside the variable 'listings'."
// REMOVED: duplicate require of routes/listing.js — listingRouter above already does this.
// const listings = require("./routes/listing");

// Review Router
// REMOVED: duplicate require of routes/review.js — reviewRouter above already does this.
// const reviews = require("./routes/review");

// =====================================================
// Configure EJS
// =====================================================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =====================================================
// Global Middleware
// =====================================================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// FIXED: your assets folder on disk is "Public" (capital P), not "public".
// If your folder is actually named lowercase "public", change this back.
app.use(express.static(path.join(__dirname, "/Public")));

// =====================================================
// Connect MongoDB
// =====================================================
main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayNest");
}



// SESSION OPTIONS
// Standard configuration for express-session.

const sessionOptions = {

    // Secret key used to sign the session cookie.
    // Prevents users from modifying the session cookie.
    secret: "mysupersecretcode",

    // Don't save the session again if nothing changed.
    // Improves performance by avoiding unnecessary writes.
    resave: false,

    // Create a session even for new visitors who haven't stored data yet.
    // Common in learning projects. In production, false is often preferred.
    saveUninitialized: true,

    // Cookie Configuration
    cookie: {

        // Absolute expiration time.
        // Session expires after 7 days from creation.
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        // Maximum lifetime of the cookie (7 days).
        // Browser automatically removes the cookie after this duration.
        maxAge: 7 * 24 * 60 * 60 * 1000,

        // Prevents JavaScript from accessing the cookie.
        // Helps protect against XSS (Cross-Site Scripting) attacks.
        httpOnly: true,
    },
};
// =====================================================
// Home Route
// =====================================================

app.get("/", (req, res) => {
    res.redirect("/listings");
})
// 1. Create session
app.use(session(sessionOptions));
//Routes say phaly flash ka use karna hoga.
app.use(flash());

//Passport implement 
//middleWare that initial and start pass
app.use(passport.initialize());
//"Use express-session to remember logged-in users."
app.use(passport.session());
//Configures Passport to use the Local Strategy for username-password authentication.
passport.use(new LocalStrategy(User.authenticate()));
//Stores the user's ID in the session after successful login.
passport.serializeUser(User.serializeUser());
//Fetches the user from the session and stores it in req.user." ✅
passport.deserializeUser(User.deserializeUser());


// Middleware: res.locals
// Runs before every route.
// Stores the flash message inside res.locals so every EJS page
// can access it without passing it through res.render().

app.use((req, res, next) => {

    // Read the "success" flash message from the session
    // and make it available to all EJS templates.
    res.locals.success = req.flash("success");
    //for errror 
    res.locals.error = req.flash("error");
    //req.user ko nav ejs mai access k liye res.local ka use karengy
    res.locals.currUser = req.user; // FIXED: was "res.req" which is not a real property — navbar needs the actual logged-in user object

    // Move to the next middleware/route.
    next();

});

// =====================================================
// DEMO USER ROUTE
// GET /demouser
// Creates and registers a sample user in the database
// =====================================================
app.get("/demouser", async (req, res) => {

    // Create a new User object
    // (Password is NOT added here because passport-local-mongoose
    // will handle it automatically)
    // let fakeUser = new User({
    //     email: "student@gmail.com",
    //     username: "JUET-student",
    // });

    // // Register the user
    // // Automatically:
    // // • Hashes the password
    // // • Generates a salt
    // // • Saves the user to MongoDB
    // let registeredUser = await User.register(fakeUser, "helloWorld");

    // // Send the registered user as response
    // res.send(registeredUser);
});

// =====================================================
// ALL ROUTES
// =====================================================

// Listing Routes
app.use("/listings", listingRouter);
// Review Routes
app.use("/listings/:id/reviews", reviewRouter);
// User Authentication Routes
app.use("/", userRouter);

// =====================================================
//ALL ROUTES explain 
// Import Listing Router
// Handles all routes related to listings
// (index, show, create, edit, update, delete)
//const listingRouter = require("./routes/listing.js");

// Import Review Router
// Handles all routes related to reviews
// (add review, delete review)
//const reviewRouter = require("./routes/review.js");

// Import User Router
// Handles all user authentication routes
// (signup, login, logout)
// Currently empty; routes will be added later.
//const userRouter = require("./routes/user.js");


// =====================================================
// Listing Routes
// Every request starting with /listings
// is forwarded to routes/listing.js
// =====================================================
// REMOVED: duplicate mount — already handled by "app.use("/listings", listingRouter);" above.
// app.use("/listings", listings);

// =====================================================
// Review Routes
// Every request starting with
// /listings/:id/reviews
// is forwarded to routes/review.js
// =====================================================
// REMOVED: duplicate mount — already handled by "app.use("/listings/:id/reviews", reviewRouter);" above.
// app.use("/listings/:id/reviews", reviews);

// =====================================================
// Catch-All Route (404)
// Runs if no route matches
// =====================================================
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// =====================================================
// Global Error Handler
// Handles all errors thrown in the application
// =====================================================
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// =====================================================
// Start Server
// =====================================================
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});