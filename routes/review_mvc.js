// =====================================================
// routes/review_mvc.js
//
// Review Routes (MVC Version)
//
// This is the MVC version of review.js.
//
// Purpose:
// • Defines only the URL routes.
// • Does NOT contain business logic.
// • Whenever a route matches,
//   the request is forwarded to the appropriate
//   controller function inside:
//
//      controllers/reviews.js
//
// Why this file?
// The original review.js is kept unchanged
// for learning and comparison.
//
// MVC Flow:
//
// Browser Request
//        ↓
// routes/review_mvc.js
//        ↓
// controllers/reviews.js
//        ↓
// models/review.js + models/listing.js
//        ↓
// MongoDB
//        ↓
// Response (Render / Redirect)
// =====================================================

const express = require("express");
const router = express.Router({ mergeParams: true });

// mergeParams:true
// Makes parent route parameters (like :id)
// available inside this router.

const wrapAsync = require("../utils/wrapAsync");

// Import reusable middleware
// Authentication, Authorization and Validation
// are handled inside middleware.js
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
} = require("../middleware.js");

// Import Review Controller
// All business logic is handled inside controllers/reviews.js
const reviewController = require("../controllers/reviews.js");


// =====================================================
// NOTE
//
// The following are NO LONGER required here:
//
// ❌ const Listing = require("../models/listing");
// ❌ const Review = require("../models/review");
// ❌ const ExpressError = require("../utils/ExpressError");
//
// Reason:
// This file only defines routes.
// All database operations are now handled inside
// controllers/reviews.js.
//
// Similarly, Joi validation code has been moved to
// middleware.js, so no validation logic is written here.
// =====================================================


// =====================================================
// CREATE REVIEW
// POST /listings/:id/reviews
// =====================================================
router.post(
    "/",
    isLoggedIn,          // Authentication → User must be logged in.
    validateReview,      // Validate review data using Joi.
    // Controller handles review creation
    wrapAsync(reviewController.createReview)
);


// =====================================================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// =====================================================
router.delete(
    "/:reviewId",
    isLoggedIn,          // Authentication
    isReviewAuthor,      // Authorization → Only review author can delete
    // Controller handles review deletion
    wrapAsync(reviewController.destroyReview)
);


// Export Router
// Used inside app_new.js
module.exports = router;