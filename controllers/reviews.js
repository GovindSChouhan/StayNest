// =====================================================
// controllers/reviews.js
//
// Review Controller
//
// Purpose:
// Contains all business logic related to Reviews.
//
// Responsibilities:
// • Create new reviews
// • Delete reviews
// • Link reviews with listings
// • Save the logged-in user as the review author
// • Update the database
// • Redirect the user after successful operations
//
// This file DOES NOT define routes.
//
// Routes are defined in:
// routes/review_mvc.js
//
// Why use a Controller?
// Instead of writing business logic inside route files,
// we move it here to keep routes small, clean,
// reusable, and easier to maintain.
//
// MVC Flow:
//
// Browser Request
//        ↓
// routes/review_mvc.js
//        ↓
// controllers/reviews.js
//        ↓
// models/review.js
// models/listing.js
//        ↓
// MongoDB
//        ↓
// Redirect / Response
// =====================================================

// Import Listing and Review models.
// Controllers interact with Models to perform
// database operations.
const Listing = require("../models/listing");
const Review = require("../models/review");



// =====================================================
// Create Review
//
// Steps:
// 1. Find the parent Listing.
// 2. Create a new Review.
// 3. Save the logged-in user as the review author.
// 4. Store the Review ObjectId inside the Listing.
// 5. Save both Review and Listing.
// 6. Redirect back to the Listing page.
// =====================================================
module.exports.createReview = async (req, res) => {

    // Listing ID comes from parent route
    let { id } = req.params;

    // Find the listing on which the review will be added
    let listing = await Listing.findById(id);

    // Create a new Review object
    let newReview = new Review(req.body.review);

    // Save the logged-in user's ID as the review author
    // This creates ownership of the review.
    newReview.author = req.user._id;

    // Store the Review's ObjectId inside the Listing
    listing.reviews.push(newReview);

    // Save Review document
    await newReview.save();

    // Save updated Listing document
    await listing.save();

    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${id}`);
};



// =====================================================
// Delete Review
//
// Steps:
// 1. Remove the Review ObjectId from the Listing.
// 2. Delete the Review document itself.
// 3. Redirect back to the Listing page.
// =====================================================
module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove Review ID from the Listing document
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete Review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
};