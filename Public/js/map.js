// =========================================================
// map.js
//
// Purpose:
// Creates and displays the interactive Mapbox map.
// This file is loaded by show.ejs
// =========================================================

// Debug (remove later)
console.log("Map JS Loaded");
console.log("Token:", mapToken);
console.log("Coordinates:", coordinates);
console.log("Listing:", listing);

// Give Mapbox the access token
mapboxgl.accessToken = mapToken;

// Create the map
const map = new mapboxgl.Map({

    // HTML element where the map will appear
    container: "map",

    // ==============================
    // Map Style (Choose only ONE)
    // ==============================

    // Streets (Default)
    // style: "mapbox://styles/mapbox/streets-v12",

    // Outdoors
    // style: "mapbox://styles/mapbox/outdoors-v12",

    // Light
    // style: "mapbox://styles/mapbox/light-v11",

    // Dark
    // style: "mapbox://styles/mapbox/dark-v11",

    // Satellite only
    // style: "mapbox://styles/mapbox/satellite-v9",

    // **** Satellite + Street Labels (Recommended)
    style: "mapbox://styles/mapbox/satellite-streets-v12",

    // New Standard Satellite
    // style: "mapbox://styles/mapbox/standard-satellite",

    // Starting location [Longitude, Latitude]
    center: coordinates,

    // Initial zoom level
    zoom: 7,
});

// Create a red marker
const marker = new mapboxgl.Marker({ color: "red" })

    // Place marker
    .setLngLat(coordinates)

    // Popup
    .setPopup(
        new mapboxgl.Popup({
            offset: 25,
            className: "my-class",
        }).setHTML(`
            <h4>${listing.location}</h4>
            <p>From - Govind_S.Chouhan</p>
        `)
    )

    // Add marker to map
    .addTo(map);