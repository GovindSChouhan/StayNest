// =====================================================
// controllers/listings.js
//
// Listing Controller
//
// Purpose:
// • Contains all business logic related to Listings.
// • Receives requests from routes.
// • Interacts with the Model (MongoDB).
// • Sends data to the View (EJS).
//
// This file DOES NOT define URLs.
// URL routes are defined in:
// routes/listing_mvc.js
//
// MVC Flow:
//
// Browser
//    ↓
// Route
//    ↓
// Controller (This File)
//    ↓
// Model
//    ↓
// Controller
//    ↓
// View
// =====================================================

const Listing = require("../models/listing");

//GITHUB copy paste
//using geocoding so that location dalo or vahi map mai show hogi 
// Import Mapbox Geocoding SDK
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//load access token too
// Read the Mapbox Access Token from .env
// (Never hardcode your token in the source code.)
const mapToken = process.env.MAP_TOKEN;
// Create a Geocoding Client.
// This client communicates with Mapbox's Geocoding API.
const geocodingClient = mbxGeocoding({accessToken : mapToken});



// =====================================================
// Controller: Index Route
// Fetch all listings and render the Home page.
// =====================================================
module.exports.index = async (req, res) => {

    // Fetch all listings from MongoDB
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
};


// =====================================================
// Controller: New Route
// Render the form to create a new listing.
// =====================================================
module.exports.renderNewForm = (req, res) => {

    // Simply render the New Listing form.
    res.render("listings/new.ejs");
};


// =====================================================
// Controller: Show Route
// Fetch one listing and display its complete details.
// =====================================================
module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    // Fetch one listing using its ID
    const listing = await Listing.findById(id)

        // Populate every review ObjectId with Review documents.
        // Then populate each Review's author ObjectId with the User document.
        // So we can access:
        // review.author.username
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })

        // Populate owner ObjectId with complete User document.
        // So we can access:
        // listing.owner.username
        .populate("owner");

    // Listing deleted but user is trying to access it.
    if (!listing) {
        req.flash("error", "Listing you requested does NOT exist!");
        return res.redirect("/listings");
    }

    console.log(listing);

    // Pass both values that browser JavaScript needs to show the map.
    // EJS should receive data from the controller instead of reading
    // process.env directly in the view.
    res.render("listings/show.ejs", { listing, mapToken });

};


// =====================================================
// Controller: Create Route
// Save a new listing into MongoDB.
// =====================================================
module.exports.createListing = async (req, res) => {

    //GEOCODING
    // =====================================================
// FORWARD GEOCODING
//
// Converts a location name into coordinates.
//
// Example:
// "New Delhi, India"
//          ↓
// [Longitude, Latitude]
// =====================================================

let response = await geocodingClient

    // Request coordinates for the given location
    .forwardGeocode({
        // Location entered by the user
        query:req.body.listing.location,
        // Return only the best matching result
        limit: 1,

    })

    // Send request to the Mapbox server
    .send();


// View the complete response in the terminal
//console.log(response.body.features[0].geometry);


// Temporary response to check whether Geocoding works
//res.send("Done!");

    const newListing = new Listing(req.body.listing);
    // Link this listing with the currently logged-in user.
    // The owner's ObjectId will be stored in the owner field.
    newListing.owner = req.user._id;

    // Save the GeoJSON geometry returned by Mapbox
    // (Contains type: "Point" and coordinates: [lng, lat])
newListing.geometry = response.body.features[0].geometry;
//console.log(newListing.geometry);
   // await newListing.save();

    // Save the listing only ONCE
    let savedListing = await newListing.save();

    // Print the saved document in the terminal
    console.log(savedListing);
    req.flash("success", "New Listing Created!");

    res.redirect("/listings");

};


// =====================================================
// Controller: Edit Route
// Fetch listing and render Edit form.
// =====================================================
module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    // Listing not found.
    if (!listing) {
        req.flash("error", "Listing you requested does NOT exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });

};


// =====================================================
// Controller: Update Route
// Update an existing listing.
// =====================================================
module.exports.updateListing = async (req, res) => {

    let { id } = req.params;

    // Convert image URL string into the required object format.
    if (typeof req.body.listing.image === "string") {

        req.body.listing.image = {
            filename: "listingimage",
            url: req.body.listing.image,
        };

    }

    // Owner is already verified by isOwner middleware.
    // Safe to update the listing.
    await Listing.findByIdAndUpdate(id, req.body.listing);

    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);

};


// =====================================================
// Controller: Delete Route
// Delete a listing from MongoDB.
// =====================================================
module.exports.destroyListing = async (req, res) => {

    let { id } = req.params;

    // Delete listing from MongoDB.
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");

};
