# 📌 StayNest Revision Notes – Index Route (GET /listings)

## Goal

Display all listings stored in MongoDB.

---

# Flow

```text
Browser
    │
GET /listings
    │
    ▼
Express Route
    │
    ▼
Listing.find({})
    │
    ▼
MongoDB
(Returns all documents)
    │
    ▼
res.render("listings/index", { allListings })
    │
    ▼
index.ejs
    │
    ▼
HTML sent to Browser
```

---

# Code

```javascript
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});
```

---

# Explanation

## app.get("/listings")

Creates a **GET Route**.

Whenever the browser visits:

```
/listings
```

this route executes.

---

## async

Database operations take time.

Using `async` allows us to use `await` and wait for MongoDB to return the data.

---

## Listing.find({})

Fetches all documents from the **listings** collection.

`{}` means **no condition**.

Examples:

```javascript
Listing.find({})
```

➡ Returns all listings.

```javascript
Listing.find({ country: "India" })
```

➡ Returns only Indian listings.

```javascript
Listing.find({ price: 1000 })
```

➡ Returns listings with price = 1000.

---

## await

Waits until MongoDB finishes the query.

Without `await`, `allListings` will contain a Promise instead of actual data.

---

## res.render()

Renders an EJS page.

```javascript
res.render("listings/index", { allListings });
```

means

* Open

```
views/listings/index.ejs
```

* Send `allListings` to that page.

---

# EJS Loop

```ejs
<% for(let listing of allListings){ %>

    <%= listing.title %>

<% } %>
```

This loops through every listing received from MongoDB.

---

# Difference

## console.log()

Prints output in Terminal.

Developer only.

---

## res.send()

Sends data directly to Browser.

Usually JSON or text.

---

## res.render()

Renders an EJS template and sends HTML to Browser.

---

# MVC

Current Flow

```
Browser
      │
      ▼
Route
      │
      ▼
Model (Listing)
      │
      ▼
MongoDB
      │
      ▼
View (index.ejs)
```

Later this route will move into a Controller.

---

# Common Errors

### 1.

```javascript
res.render("/listings/index.ejs")
```

❌ Wrong

Correct

```javascript
res.render("listings/index")
```

---

### 2.

Forgetting

```javascript
app.set("view engine", "ejs");
```

Express cannot render EJS.

---

### 3.

Forgetting

```javascript
app.set("views", path.join(__dirname, "views"));
```

Express cannot locate the views folder.

---

### 4.

Using

```javascript
.then((res)=>{})
```

inside route.

Wrong because `res` already represents Express Response Object.

Use

```javascript
.then((result)=>{})
```

instead.

---

# Interview Questions

## Q1. What does `Listing.find({})` do?

**Answer**

`find()` searches documents in MongoDB.

An empty object `{}` means no filter.

So it returns every document from the collection.

---

## Q2. Why use `await`?

Because MongoDB queries are asynchronous.

`await` pauses execution until data is returned.

---

## Q3. Difference between `res.send()` and `res.render()`?

`res.send()` sends raw data or text.

`res.render()` renders an EJS template and returns HTML.

---

## Q4. Why create a `views/listings` folder?

To organize EJS files by feature.

It follows MVC architecture and makes large projects easier to maintain.

---

# Revision (30 Seconds)

* GET Route → `/listings`
* `Listing.find({})` → Fetch all documents.
* `{}` → No filter.
* `await` → Wait for database response.
* `res.render()` → Render EJS page.
* `allListings` → Passed to EJS.
* EJS `for...of` loop displays every listing.
* Follows MVC Architecture.

---

## StayNest Note ⭐

Current functionality is identical to the tutorial.

Later improvements planned:

* Student Friendly Badge
* Study Friendly Tags
* College Nearby Filter
* Safety Rating
* Wishlist
* Reviews
* Roommate Friendly Listings

These features will make StayNest different from a basic Airbnb clone while keeping the same core architecture.
