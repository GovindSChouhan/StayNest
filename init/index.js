const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayNest";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    //once all data deletedthen we insert 
  await Listing.deleteMany({});
  // Add the same owner (User ObjectId) to every sample listing
// before inserting them into the database
  //initData.data = initData.data.map((obj) => ({...obj, owner: "6a552cc4019b48354d303049"}));
// =====================================================
// Add extra fields before inserting sample listings.
//
// We add:
// 1. owner    -> So every listing belongs to the same user.
// 2. geometry -> Sample listings don't have coordinates,
//                so we assign the JIIT Noida location.
// =====================================================

initData.data = initData.data.map((obj) => ({

    // Copy all existing listing fields
    ...obj,

    // Default owner for every sample listing
    owner: "6a552cc4019b48354d303049",

    // Default GeoJSON location (JIIT Noida)
    geometry: {
        type: "Point",

        // [Longitude, Latitude]
        coordinates: [77.37208, 28.63004],
    }

}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();

// =====================================================

//const initDB = async () => {
// Initialize (Reset) the Database
//
// Purpose:
// Restore the database to its original sample state.
//
// Steps:
// 1. Delete all existing listings (including test/edited data).
// 2. Insert fresh sample listings from initData.data.
//
// Used only by the developer during development,
// NOT when normal users create or edit listings.
// =====================================================