require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
}

const initDB = async () => {
    console.log("Deleting old listings...");
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a60f44baf7db9c0f19b065a",
        geometry: {
            type: "Point",
            coordinates: [77.37208, 28.63004],
        },
    }));

    console.log("Inserting new listings...");
    await Listing.insertMany(initData.data);

    console.log("Data was initialized!");

    mongoose.connection.close();
};

main()
    .then(initDB)
    .catch(console.log);