# 📌 StayNest – Create Route (POST /listings)

## Code

```javascript
const newListing = new Listing(req.body.listing);

await newListing.save();

res.redirect("/listings");
```

---

# Step 1

```javascript
const newListing = new Listing(req.body.listing);
```

### What happens?

The HTML form sends:

```javascript
req.body = {
    listing: {
        title: "My Villa",
        description: "Beautiful Beach View",
        image: "...",
        price: 1200,
        location: "Indore",
        country: "India"
    }
}
```

`req.body.listing` contains the complete listing object.

`new Listing(req.body.listing)` creates a **new Mongoose Document**.

⚠️ **It is NOT saved in MongoDB yet.**

Think of it as:

```text
Form Data
      │
      ▼
JavaScript Object
      │
      ▼
Mongoose Document (new Listing)
      │
      ▼
Memory Only (Not saved)
```

---

# Step 2

```javascript
await newListing.save();
```

### What happens?

The Mongoose document is now saved permanently into MongoDB.

`await` waits until MongoDB confirms the save operation.

After this line, the data exists inside the `listings` collection.

---

# Step 3

```javascript
res.redirect("/listings");
```

### Why redirect?

After successfully creating a listing, the browser is redirected to:

```text
GET /listings
```

The Index Route runs again and displays the updated list including the newly created listing.

Flow:

```text
POST /listings
      │
      ▼
Save Listing
      │
      ▼
Redirect
      │
      ▼
GET /listings
      │
      ▼
Updated List Displayed
```

---

# Complete Flow

```text
User fills Form
        │
        ▼
POST /listings
        │
        ▼
req.body.listing
        │
        ▼
new Listing(req.body.listing)
(Create Mongoose Document)
        │
        ▼
await newListing.save()
(Save in MongoDB)
        │
        ▼
res.redirect("/listings")
        │
        ▼
Index Route
        │
        ▼
Updated Listings Page
```

---

# Interview Questions

### Q1. Why use `new Listing()`?

It creates a new Mongoose document using the data received from the form.

---

### Q2. Is the data saved after `new Listing()`?

No.

It only creates a document in memory.

The data is saved only after calling:

```javascript
await newListing.save();
```

---

### Q3. Why use `await` with `save()`?

Saving data is asynchronous.

`await` waits until MongoDB successfully stores the document.

---

### Q4. Why use `res.redirect("/listings")` instead of `res.send()`?

After creating a listing, we want the user to see the updated list of all listings.

`redirect()` sends the browser to the Index Route (`GET /listings`), which fetches fresh data from MongoDB and displays it.

---

# 30-Second Revision

* `req.body.listing` → Form data as an object.
* `new Listing()` → Creates a Mongoose document (not saved yet).
* `save()` → Stores the document in MongoDB.
* `await` → Wait for the save operation to complete.
* `redirect("/listings")` → Opens the Index Route and shows the updated list.
