// =====================================================
// models/listing.js
//
// Listing Model (Mongoose Schema)
//
// Purpose:
// - Defines the structure (schema) of a Listing document.
// - Specifies what fields every listing will have.
// - Creates and exports the Listing model.
//
// This file ONLY defines the database structure.
// It does NOT contain routes or business logic.
//
// Used by:
// - routes/listing.js (CRUD operations)
// - Any file that needs to create, read, update, or delete listings.
// =====================================================

const mongoose = require("mongoose");


// initiliz a var so that again again na likhna pady
const Schema = mongoose.Schema;

//to del a review with listing.
const Review = require("./review.js");

// Define schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        },
    },

    price: Number,
    location: String,
    country: String,
    //Review adding exrea schemma review
    // One Listing can have multiple Reviews.
 // Each review stores only itsMongoDB ID ObjectId.
 // `ref: "Review"` tells Mongoose that these ObjectIds
 // belong to the Review model.
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref : "Review", 
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
   // =====================================================
// GeoJSON Geometry
//
// Stores the location coordinates of a listing.
// Format:
// {
//     type: "Point",
//     coordinates: [longitude, latitude]
// }
// =====================================================

geometry: {
    type: {
        type: String,
        enum: ["Point"],     // GeoJSON requires "Point" (capital P)
        required: true,
    },

    coordinates: {           // Correct spelling
        type: [Number],
        required: true,
    },
},

});

    // Mongoose Post Middleware
// Runs AFTER a Listing is deleted.
// Deletes all Review documents whose ObjectIds are stored
// inside the deleted Listing's reviews array.
// This prevents orphan (unused) reviews from remaining in the database.

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

// It creates a Mongoose Model named Listing using the ListingSchema.
const Listing = mongoose.model("Listing", listingSchema);

// module.exports ka use hum kisi variable,
// function ya Mongoose model ko dusri files mein
// use karne ke liye karte hain.

module.exports = Listing;