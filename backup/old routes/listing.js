const express = require("express");
const router = express.Router();

const Listing = require("../../models/listing.js");
const wrapAsync = require("../../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError");
// const { listingSchema } = require("../schema.js");

//all listings ,middleware check
const {isLoggedIn, isOwner, validateListing} = require("../../middleware.js");

//require controller wala index route
//const listingController = require("../controller/listings.js");



// Middleware to validate Listing data using Joi
//gone to middleware.js

// =====================================================
// INDEX ROUTE
// GET /listings
// Show all listings
// =====================================================
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// =====================================================
// NEW ROUTE
// GET /listings/new
// Render form to create a new listing
// =====================================================
router.get("/new",isLoggedIn,  (req, res) => {
    console.log(req.user);
   
    res.render("listings/new.ejs");

});

// =====================================================
// SHOW ROUTE
// GET /listings/:id
// Show details of one listing
// =====================================================
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id)
    // Populate the owner ObjectId with the complete User document
    // Then, inside each Review, populate the author ObjectId with the User document
// So we can access: listing.owner.username
    .populate({
        path:"reviews",
        populate: {
            path: "author",
        }
    })
    // Populate the owner ObjectId with the complete User document
// So we can access: listing.owner.username
    .populate("owner");
    //listing deleted and user try to view it 
    if(!listing) {
        req.flash("error", "Listing you requested for does NOT exist!"); 
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });

}));

// =====================================================
// CREATE ROUTE
// POST /listings
// Save new listing into database
// =====================================================
router.post(
    "/",
    validateListing,isLoggedIn,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);
        //before NewListing save we have to get Owner info
        // Link this listing to the currently logged-in user
        newListing.owner = req.user._id;
        await newListing.save();
        //flash pop-up
        req.flash("success", "new listing created");
        res.redirect("/listings");

    })
);

// =====================================================
// EDIT ROUTE
// GET /listings/:id/edit
// Render edit form
// =====================================================
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);
 if(!listing) {
        req.flash("error", "Listing you requested for does NOT exist!"); 
        res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs", { listing });

}));

// =====================================================
// UPDATE ROUTE
// PUT /listings/:id
// Update existing listing
// =====================================================
router.put(
    "/:id", isLoggedIn,isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        // Convert image URL string into required object format
        if (typeof req.body.listing.image === "string") {
            req.body.listing.image = {
                filename: "listingimage",
                url: req.body.listing.image,
            };
        }
        
        // Owner verified → Update the listing
        await Listing.findByIdAndUpdate(id, req.body.listing);
        req.flash("success" , "Listing updated! ");
        // Redirect to the updated listing page
        res.redirect(`/listings/${id}`);

    })
);

// =====================================================
// DELETE ROUTE
// DELETE /listings/:id
// Delete listing
// =====================================================
router.delete("/:id", isLoggedIn, isOwner,wrapAsync(async (req, res) => {

    let { id } = req.params;

   let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");

}));
//send thi to app_new.js
module.exports = router;

