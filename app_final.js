// =====================================================
// app_final.js
//
// Main server file for the MVC version of StayNest.
//
// Important:
// - This file does NOT replace app_new.js.
// - app_new.js can remain your original working version.
// - This file uses the MVC route files, which send their
//   work to controller files.
//
// MVC request flow:
// Browser -> routes/*_mvc.js -> controllers/*.js
//         -> models/*.js -> MongoDB -> EJS views
// =====================================================

// =====================================================
// app_final.js
//
// Main Entry Point of the StayNest Application (MVC)
//
// Purpose:
// • Starts the Express Server
// • Connects MongoDB
// • Configures Express
// • Configures Passport Authentication
// • Configures Sessions & Flash Messages
// • Loads all MVC Routes
//
// NOTE:
// This file does NOT contain business logic.
//
// Business Logic
//        ↓
// controllers/*.js
//
// Database Logic
//        ↓
// models/*.js
//
// Routes
//        ↓
// routes/*_mvc.js
//
// Views
//        ↓
// views/*.ejs
//
// MVC Flow
//
// Browser
//    ↓
// app_final.js
//    ↓
// routes/*_mvc.js
//    ↓
// controllers/*.js
//    ↓
// models/*.js
//    ↓
// MongoDB
//    ↓
// controllers/*.js
//    ↓
// EJS Views
// =====================================================

// Load environment variables from .env
require("dotenv").config();
const express = require("express");
const app = express();
app.locals.currUser = null;
app.locals.success = [];
app.locals.error = [];

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
//Mongo Store connect-mongo is used to store Express session data in MongoDB.
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");


// =====================================================
// IMPORT MODELS
//
// User model is required by Passport Authentication.
//
// authenticate()
// serializeUser()
// deserializeUser()
//
// are automatically added by
// passport-local-mongoose.
// =====================================================
const User = require("./models/user.js");


// =====================================================
// CUSTOM ERROR CLASS
//
// Used whenever we want to throw our own errors
// like:
//
// throw new ExpressError(404,"Page Not Found!")
// =====================================================
const ExpressError = require("./utils/ExpressError.js");


// =====================================================
// IMPORT MVC ROUTERS
//
// Routes contain:
//
// • URL Endpoints
// • Middleware
//
// They DO NOT contain database logic.
//
// Database logic exists inside:
//
// controllers/
// =====================================================
const listingMvcRouter = require("./routes/listing_mvc.js");
const reviewMvcRouter = require("./routes/review_mvc.js");
const userMvcRouter = require("./routes/user_mvc.js");


// =====================================================
// EJS CONFIGURATION
//
// ejsMate
// → enables layouts/boilerplate.ejs
//
// View Engine
// → tells Express to render EJS files.
//
// Views Folder
// → tells Express where EJS files are stored.
// =====================================================
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


// =====================================================
// GLOBAL MIDDLEWARE
//
// express.urlencoded()
// → Reads form data.
//
// methodOverride()
// → Allows HTML forms to use PUT & DELETE.
//
// express.static()
// → Serves static files.
//
// Example:
//
// CSS
// Images
// JS
// Logo
// =====================================================
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "Public")));


// =====================================================
// CONNECT TO MONGODB
//
// main() establishes connection
// before the application starts.
// =====================================================
// async function main() {

//     await mongoose.connect(
//         "mongodb://127.0.0.1:27017/stayNest"
//     );

// }

// main()
// .then(() => console.log("MongoDB connection successful"))
// .catch((err) => console.log(err));
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.log(err));


// =====================================================
// SESSION CONFIGURATION
//
// Session stores:
//
// • Login Information
// • Flash Messages
//
// Cookie expires after 7 days.
// =====================================================
// Create a MongoDB session store
// Instead of storing user sessions in server memory,
// sessions will be stored in MongoDB.
// This keeps users logged in even after the server restarts.

const store = MongoStore.create({
    // MongoDB Atlas connection URL
    mongoUrl: dbUrl,

    // Keep sessions created by the previous crypto configuration separate.
    collectionName: "sessions_v2",

    // Update the session in the database only once every 24 hours
    // if nothing has changed. This reduces unnecessary database writes.
    touchAfter: 24 * 3600,
});

// Listen for errors from the MongoDB session store.
// If the session store fails (e.g., database connection issue),
// this callback will log the error to the console.

store.on("error", (err) => {
    console.log("Error in Mongo Session Store:", err);
});
const sessionOptions = {
    // Store session data in MongoDB instead of server memory.
    // This keeps users logged in even if the server restarts.
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    cookie: {

        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        maxAge: 7 * 24 * 60 * 60 * 1000,

        httpOnly: true,

    }

};


app.use(session(sessionOptions));


// =====================================================
// FLASH MESSAGES
//
// Used to show messages like:
//
// Listing Created
// Login Successful
// Invalid Password
// =====================================================
app.use(flash());


// =====================================================
// PASSPORT CONFIGURATION
//
// Passport manages:
//
// • Signup
// • Login
// • Logout
// • Authentication
// • Session Management
// =====================================================
app.use(passport.initialize());

app.use(passport.session());

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// =====================================================
// GLOBAL LOCALS
//
// Makes these variables available
// in EVERY EJS page automatically.
//
// success
// error
// currUser
//
// So there is no need to pass them
// inside every res.render().
// =====================================================
app.use((req, res, next) => {

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currUser = req.user || null;

    next();

});


// =====================================================
// HOME ROUTE
//
// Redirect:
//
// /
//
//      ↓
//
// /listings
// =====================================================
app.get("/", (req, res) => {

    res.redirect("/listings");

});


// =====================================================
// LOAD MVC ROUTERS
//
// Every request first comes here.
//
// Express checks the URL
// and forwards it to the correct router.
//
// Example:
//
// /listings
//      ↓
// listing_mvc.js
//
// /listings/:id/reviews
//      ↓
// review_mvc.js
//
// /signup
// /login
// /logout
//      ↓
// user_mvc.js
// =====================================================
app.use("/listings", listingMvcRouter);

app.use("/listings/:id/reviews", reviewMvcRouter);

app.use("/", userMvcRouter);


// =====================================================
// 404 ROUTE
//
// Executes only when no route matched.
//
// Example:
//
// /abcdxyz
//
// → Page Not Found
// =====================================================
app.all("*", (req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found!"
        )
    );

});


// =====================================================
// GLOBAL ERROR HANDLER
//
// Every thrown error eventually
// comes here.
//
// Displays error.ejs
// =====================================================
app.use((err, req, res, next) => {

    const {

        statusCode = 500,

        message = "Something went wrong!"

    } = err;

    res.status(statusCode)
       .render("error.ejs", { message });

});


// =====================================================
// START SERVER
//
// NOTE:
//
// Only ONE server can use port 8080.
//
// If app_new.js is running,
// stop it first.
//
// Then run:
//
// node app_final.js
// =====================================================
app.listen(8080, () => {

    console.log("MVC App Running on Port 8080");

});
