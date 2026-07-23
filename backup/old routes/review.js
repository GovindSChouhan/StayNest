const express = require("express");
const router = express.Router({ mergeParams: true });
//"Merge (combine) the parent route's parameters with this router's parameters.
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listing");
const Review = require("../models/review");
const{validateReview,  isLoggedIn, isReviewAuthor} = require("../middleware.js");


// const { reviewSchema } = require("../schema");

// =====================================================
// Joi Validation Middleware
// Validates Review data before saving
// =====================================================
//gone to middleware.js

// =====================================================
// CREATE REVIEW
// POST /listings/:id/reviews
// =====================================================
router.post(
    "/",
    isLoggedIn,       // Authentication → Only logged-in users can add a review.
    validateReview,   // Validate review data before saving.
    wrapAsync(async (req, res) => {

        // Listing ID comes from parent route
        let { id } = req.params;

        // Find the listing on which review will be added
        let listing = await Listing.findById(id);

        // Create a new Review object
        let newReview = new Review(req.body.review);

        // Save the logged-in user's ID as the review author
        // (This is how ownership/authorization is linked to the review.)
        newReview.author = req.user._id;

        // Store the Review's ObjectId inside the Listing
        listing.reviews.push(newReview);

        // Save Review document
        await newReview.save();

        // Save updated Listing document
        await listing.save();

        req.flash("success", "New Review Created!");

        res.redirect(`/listings/${id}`);
    })
);

// =====================================================
// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId
// =====================================================
router.delete(
    "/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(async (req, res) => {

        let { id, reviewId } = req.params;

        // Remove Review ID from Listing
        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });

        // Delete Review document
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted!")
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;