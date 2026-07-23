// =====================================================
// routes/user_mvc.js
//
// User Authentication Routes (MVC Version)
//
// This is the MVC version of user.js.
//
// Purpose:
// • Defines only authentication routes.
// • Does NOT contain business logic.
// • Whenever a route matches,
//   the request is forwarded to the appropriate
//   controller function inside:
//
//      controllers/users.js
//
// Features:
// • Signup
// • Login
// • Logout
//
// Why this file?
// The original user.js is kept unchanged
// for learning and comparison.
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

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

// Passport Authentication
const passport = require("passport");

// Middleware
const { saveRedirectUrl } = require("../middleware.js");

// Import User Controller
// All business logic is handled inside controllers/users.js
const userController = require("../controllers/users.js");


// =====================================================
// SIGNUP
// =====================================================

// Render Signup Form
router.get("/signup", userController.renderSignupForm);

// Register New User
router.post(
    "/signup",
    wrapAsync(userController.signup)
);


// =====================================================
// LOGIN
// =====================================================

// Render Login Form
router.get("/login", userController.renderLoginForm);

// Authenticate User
router.post(
    "/login",

    // Save the URL requested before login
    saveRedirectUrl,

    // Passport verifies username & password
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),

    // If login succeeds,
    // controllers/users.js handles flash message
    // and redirection.
    userController.login
);


// =====================================================
// LOGOUT
// =====================================================

// Logout current user
router.get("/logout", userController.logout);


// Export Router
// Used inside app_new.js
module.exports = router;


// =====================================================
// Login Flow
//
// POST /login
//         │
//         ▼
// saveRedirectUrl
//         │
//         ▼
// passport.authenticate("local")
//         │
//         ├── ❌ Login fails
//         │      │
//         │      ├── Flash error
//         │      └── Redirect to /login
//         │
//         └── ✅ Login succeeds
//                │
//                ▼
//         controllers/users.js
//                │
//                ▼
//      Flash Success + Redirect
// =====================================================