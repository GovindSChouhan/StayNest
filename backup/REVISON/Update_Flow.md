# 📝 StayNest – Complete UPDATE Flow

```text
User clicks "Edit"
        │
        ▼
<a href="/listings/<%= listing._id %>/edit">

        │
        ▼
Browser sends

GET /listings/6a4decd968f413c273d9a869/edit

        │
        ▼
Express matches

app.get("/listings/:id/edit")

        │
        ▼
req.params.id

↓

6a4decd968f413c273d9a869

        │
        ▼
Listing.findById(id)

        │
        ▼
MongoDB returns the listing

        │
        ▼
res.render("edit.ejs", { listing })

        │
        ▼
EJS pre-fills the form

value="<%= listing.title %>"
value="<%= listing.price %>"
...

        │
        ▼
User edits the values

        │
        ▼
Clicks "Edit"

        │
        ▼
Browser reads

<form
method="POST"
action="/listings/6a4decd968f413c273d9a869?_method=PUT">

        │
        ▼
Browser sends

POST /listings/6a4decd968f413c273d9a869?_method=PUT

        │
        ▼
method-override middleware

app.use(methodOverride("_method"))

        │
        ▼
Changes

POST
↓

PUT

        │
        ▼
Express matches

app.put("/listings/:id")

        │
        ▼
req.params.id

↓

6a4decd968f413c273d9a869

        │
        ▼
req.body.listing

↓

{
title: "...",
description: "...",
price: ...,
location: "...",
country: "..."
}

        │
        ▼
Listing.findByIdAndUpdate(
id,
{ ...req.body.listing }
)

        │
        ▼
MongoDB updates the document

        │
        ▼
res.redirect("/listings")

        │
        ▼
Updated listings page displayed
```

---

## ⭐ Interview Summary

**Edit Route (GET)**

* Fetches the existing listing using its ID.
* Sends the listing to `edit.ejs`.
* Displays a pre-filled form.

**Update Route (PUT)**

* Receives the edited form data.
* `method-override` converts POST → PUT.
* `findByIdAndUpdate()` updates the document in MongoDB.
* Redirects to the listings page after a successful update.
