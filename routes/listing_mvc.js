// =====================================================
// routes/listing_mvc.js
//
// Listing Routes (MVC)
//
// Purpose:
// • Defines only URL routes (Endpoints).
// • Does NOT contain business logic.
// • When a route matches, the request is forwarded
//   to the corresponding controller function.
//
// Business logic is stored in:
// controllers/listings.js
//
// Flow:
// Browser Request
//       ↓
// Route
//       ↓
// Controller
//       ↓
// Model (MongoDB)
//       ↓
// Controller
//       ↓
// View (EJS)
// =====================================================

const express = require("express");
const router = express.Router();

// Listing Model (used only if needed in routes)
const Listing = require("../models/listing");

const wrapAsync = require("../utils/wrapAsync");

// Reusable Middleware
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// Import Listing Controller
// Every route below calls one function from this controller.
const listingController = require("../controllers/listings.js");


// =====================================================
// INDEX ROUTE
// GET /listings
//
// Show all listings.
// Calls:
// listingController.index()
// =====================================================
router.get("/", wrapAsync(listingController.index));


// =====================================================
// NEW ROUTE
// GET /listings/new
//
// Show the form for creating a new listing.
//
// Middleware:
// isLoggedIn → Only logged-in users can access.
// =====================================================
router.get("/new", isLoggedIn, listingController.renderNewForm);


// =====================================================
// SHOW ROUTE
// GET /listings/:id
//
// Show one listing with all its details.
// =====================================================
router.get("/:id", wrapAsync(listingController.showListing));


// =====================================================
// CREATE ROUTE
// POST /listings
//
// Save a new listing into MongoDB.
//
// Middleware Order:
// validateListing → Validate form data
// isLoggedIn      → User must be logged in
// =====================================================
router.post(
    "/",
    validateListing,
    isLoggedIn,
    wrapAsync(listingController.createListing)
);


// =====================================================
// EDIT ROUTE
// GET /listings/:id/edit
//
// Show Edit Form.
//
// Middleware:
// isLoggedIn → User must be logged in
// isOwner    → Only listing owner can edit
// =====================================================
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


// =====================================================
// UPDATE ROUTE
// PUT /listings/:id
//
// Update an existing listing.
//
// Middleware:
// isLoggedIn
// isOwner
// validateListing
// =====================================================
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);


// =====================================================
// DELETE ROUTE
// DELETE /listings/:id
//
// Delete a listing.
//
// Middleware:
// isLoggedIn
// isOwner
// =====================================================
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);


// Export Router
// Used in app_mvc.js (or app_new.js)
module.exports = router;