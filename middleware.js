// =====================================================
// middleware.js
// Stores reusable middleware functions.
//
// Why?
// Instead of writing the same logic in every route,
// we create it once here and reuse it wherever needed.
// Example:
// • Authentication check (is user logged in?)
// • Authorization
// • Validation
// =====================================================


// =====================================================
// Middleware: isLoggedIn
//
// Purpose:
// Protect private routes.
//
// If the user is NOT logged in:
// 1. Save the URL they originally wanted to visit.
// 2. Redirect them to the login page.
// After successful login, they will automatically return
// to the same page instead of the default page.
// =====================================================
//lisng require
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {

    // Compare router path and original URL (for learning/debugging)
    console.log(req.path, "..", req.originalUrl);

    // Check whether the user is logged in
    if (!req.isAuthenticated()) {

        // Save the original requested URL
        // Example:
        // User requested: /listings/new
        // Save it so we can redirect back after login.
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in to create listings!");

        return res.redirect("/login");
    }

    // User is logged in → continue to the next middleware/route
    next();
};
// Middleware to validate Listing data using Joi
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};
// =====================================================
// Middleware: validateReview
//
// Purpose:
// Validate incoming review data using Joi.
//
// If validation fails:
// • Stop the request
// • Throw ExpressError(400)
//
// If validation succeeds:
// • Continue to the next middleware
// =====================================================
module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};


// =====================================================
// Middleware: saveRedirectUrl
//
// Purpose:
// Copy the saved redirect URL from the session into
// res.locals so it is available during the current request.
//
// This middleware runs before successful login.
// =====================================================
module.exports.saveRedirectUrl = (req, res, next) => {

    // If a redirect URL was saved by isLoggedIn,
    // make it available to the login route.
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};



// =====================================================
// Check Listing Ownership (Authorization)
//
// Purpose:
// Allow only the owner of a listing to edit or delete it.
//
// Steps:
// 1. Get the listing using its ID.
// 2. Compare the listing owner's ObjectId with the
//    currently logged-in user's ObjectId.
// 3. If they don't match, show an error and redirect.
// 4. If they match, allow the request to continue.
// =====================================================

module.exports.isOwner = async (req, res, next) => {

    let { id } = req.params;

    // Find the listing from the database
    const listing = await Listing.findById(id);

    // Check if the logged-in user owns this listing
    if (!listing.owner.equals(req.user._id)) {

        req.flash("error", "You are not the owner of this Listing.");

        return res.redirect(`/listings/${id}`);
    }

    // Owner verified → Continue to the next middleware/route
    next();
};
// =====================================================
//isReviewAuthor
// =====================================================
// =====================================================
// Check Review Ownership (Authorization)
//
// Purpose:
// Allow only the review author to delete/edit the review.
// =====================================================

module.exports.isReviewAuthor = async (req, res, next) => {

    let { id, reviewId } = req.params;
    // Find the review from the database
    let review = await Review.findById(reviewId);
    // Check if the logged-in user is the review author

    //  console.log("--------------------");
    // console.log("Review Author:", review.author);
    // console.log("Current User :", req.user._id);
    // console.log("Equal?", review.author.equals(req.user._id));

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }

    // Author verified → Continue
    next();
};