# 🌍 StayNest - Mapbox Integration Notes

---

# Why Mapbox?

Mapbox is used to display an interactive map for every listing.

Instead of only showing a location name like:

```
New Delhi, India
```

we also show its exact position on the map.

---

# Flow of Mapbox

User enters Location
        ↓
Mapbox Geocoding API
        ↓
Returns Longitude & Latitude
        ↓
Store GeoJSON in MongoDB
        ↓
Controller sends data to EJS
        ↓
show.ejs passes data to map.js
        ↓
Mapbox renders Map + Marker + Popup

---

# Step 1 - Install Packages

```bash
npm install @mapbox/mapbox-sdk
npm install dotenv
```

---

# Step 2 - Create Mapbox Account

Generate an Access Token.

Store it inside `.env`

```env
MAP_TOKEN=pk.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Never push `.env` to GitHub.

Add inside `.gitignore`

```gitignore
.env
```

---

# Step 3 - Load Environment Variables

Inside app.js

```js
require("dotenv").config();
```

Now we can use

```js
process.env.MAP_TOKEN
```

---

# Step 4 - Geocoding

Import SDK

```js
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
```

Create Client

```js
const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN,
});
```

---

# Step 5 - Forward Geocoding

Convert location into coordinates.

```js
let response = await geocodingClient
.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
})
.send();
```

Example

Input

```
New Delhi
```

Output

```js
{
    type: "Point",
    coordinates: [
        77.2090,
        28.6139
    ]
}
```

---

# Step 6 - Save GeoJSON

```js
newListing.geometry = response.body.features[0].geometry;
```

Now MongoDB stores

```js
geometry: {
    type: "Point",
    coordinates: [
        77.209,
        28.6139
    ]
}
```

---

# GeoJSON

GeoJSON is a standard format used for geographical data.

Example

```js
geometry: {

    type: "Point",

    coordinates: [
        longitude,
        latitude
    ]
}
```

Remember

```
Longitude comes first

NOT

Latitude
```

Correct

```
[77.2090, 28.6139]
```

Wrong

```
[28.6139, 77.2090]
```

---

# Listing Schema

```js
geometry: {

    type: {

        type: String,

        enum: ["Point"],

        required: true,

    },

    coordinates: {

        type: [Number],

        required: true,

    },

}
```

---

# Controller → View

EJS cannot directly access

```js
process.env
```

So controller sends data.

```js
res.render("listings/show.ejs", {
    listing,
});
```

---

# show.ejs

Pass variables to JavaScript.

```ejs
<script>

const mapToken = "<%= process.env.MAP_TOKEN %>";

const coordinates =
<%- JSON.stringify(listing.geometry.coordinates) %>;

const listing =
<%- JSON.stringify(listing) %>;

</script>

<script src="/js/map.js"></script>
```

---

# map.js

Access Token

```js
mapboxgl.accessToken = mapToken;
```

Create Map

```js
const map = new mapboxgl.Map({

    container: "map",

    style:
    "mapbox://styles/mapbox/satellite-streets-v12",

    center: coordinates,

    zoom: 7,

});
```

---

# Marker

```js
const marker = new mapboxgl.Marker({

    color: "red",

})

.setLngLat(coordinates)

.addTo(map);
```

---

# Popup

```js
marker.setPopup(

new mapboxgl.Popup({

    offset: 25,

})

.setHTML(`

<h4>${listing.location}</h4>

<p>From - Govind_S.Chouhan</p>

`)

);
```

---

# Mapbox Styles

Default

```js
style:
"mapbox://styles/mapbox/streets-v12"
```

Dark

```js
style:
"mapbox://styles/mapbox/dark-v11"
```

Satellite

```js
style:
"mapbox://styles/mapbox/satellite-v9"
```

Satellite + Streets ⭐

```js
style:
"mapbox://styles/mapbox/satellite-streets-v12"
```

---

# Common Errors

## 1.

```
An API access token is required
```

Reason

```
MAP_TOKEN missing

or

dotenv not loaded
```

---

## 2.

```
pk is not defined
```

Wrong

```js
const mapToken =
<%= process.env.MAP_TOKEN %>;
```

Correct

```js
const mapToken =
"<%= process.env.MAP_TOKEN %>";
```

---

## 3.

```
Invalid LngLat object
```

Reason

Coordinates are

```js
[]
```

or

Wrong order

```
Latitude

Longitude
```

---

## 4.

```
Container 'map' not found
```

Reason

```
<div id="map"></div>

doesn't exist

or

map.js loads before HTML.
```

---

## 5.

Old Listings show no map

Reason

Old listings were created before

```
geometry
```

was added.

Create a new listing or update old documents.

---

# Interview Questions

## Why Mapbox?

To display an interactive map for each listing using real-world geographical coordinates.

---

## What is Geocoding?

Geocoding converts a location name into geographical coordinates.

Example

```
Delhi

↓

77.2090

28.6139
```

---

## What is GeoJSON?

GeoJSON is a standard format for storing geographical data.

Example

```js
geometry: {

type: "Point",

coordinates: [

longitude,

latitude

]

}
```

---

## Why use `.env`?

To securely store sensitive information like API keys instead of hardcoding them.

---

## Why JSON.stringify()?

Because EJS objects need to be converted into valid JavaScript objects before they can be used inside map.js.

---

# Revision Keywords

- Mapbox
- Access Token
- dotenv
- Geocoding
- Forward Geocode
- GeoJSON
- Longitude
- Latitude
- Marker
- Popup
- MVC
- Environment Variables
- JSON.stringify()
- External API