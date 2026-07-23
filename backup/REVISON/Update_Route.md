# 📝 StayNest Revision Notes – UPDATE Route (Edit + Update)

## 🎯 Purpose

The **Update feature** allows a user to **modify an existing listing**.

It is completed in **2 steps**:

1. **GET Route (Edit)** → Fetch existing data and show it in a pre-filled form.
2. **PUT Route (Update)** → Save the updated data to MongoDB.

---

# 1️⃣ EDIT Route (GET)

```js
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
});
```

## What it does

* User clicks **Edit**.
* Browser sends a **GET** request.
* Express extracts the listing ID.
* MongoDB finds that listing.
* Express renders **edit.ejs** with the existing data.

---

## Line-by-Line

### 1.

```js
let { id } = req.params;
```

✔ Extracts the listing ID from the URL.

Example:

```
/listings/64ab12/edit
```

```
id = "64ab12"
```

---

### 2.

```js
const listing = await Listing.findById(id);
```

✔ Fetches the existing listing from MongoDB.

---

### 3.

```js
res.render("listings/edit.ejs", { listing });
```

✔ Sends the listing object to EJS.

Now EJS can access:

```ejs
listing.title
listing.price
listing.location
```

to pre-fill the form.

---

# Why use

```ejs
value="<%= listing.title %>"
```

Because the user should see the old value and edit only what they want instead of filling the entire form again.

---

# 2️⃣ UPDATE Route (PUT)

```js
app.put("/listings/:id", async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect("/listings");

});
```

---

## Line-by-Line

### 1.

```js
let { id } = req.params;
```

✔ Extracts the listing ID.

---

### 2.

```js
await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing }
);
```

✔ Finds the document using its ID.

✔ Replaces the old values with the new values received from the form.

✔ Saves the updated document.

---

### Why use

```js
{ ...req.body.listing }
```

The spread operator copies all properties from the submitted form object.

Example:

```js
req.body.listing = {
    title: "Beach Villa",
    price: 5000
}
```

becomes

```js
{
    title: "Beach Villa",
    price: 5000
}
```

and Mongoose updates those fields.

---

### 3.

```js
res.redirect("/listings");
```

✔ Redirects the user to the Index page after updating successfully.

---

# Why Method Override?

HTML forms support only:

* GET
* POST

To perform an update, we need **PUT**.

So we write:

```ejs
<form
method="POST"
action="/listings/<%= listing._id %>?_method=PUT">
```

Then:

```js
app.use(methodOverride("_method"));
```

changes

```
POST
```

↓

```
PUT
```

before Express checks the routes.

---

# Complete Flow

```
User clicks Edit
        │
        ▼
GET /listings/:id/edit
        │
        ▼
findById()
        │
        ▼
edit.ejs (Pre-filled Form)
        │
User changes values
        │
Clicks Edit
        │
        ▼
POST + ?_method=PUT
        │
        ▼
method-override
        │
        ▼
PUT /listings/:id
        │
        ▼
findByIdAndUpdate()
        │
        ▼
MongoDB Updated
        │
        ▼
redirect("/listings")
```

---

# Interview Questions

### Why GET for Edit Route?

GET only fetches existing data and displays the edit form. No database changes happen.

---

### Why PUT for Update Route?

PUT is used because we are modifying an existing resource.

---

### Why `findByIdAndUpdate()`?

It finds the document using its `_id` and updates it in one step.

---

### Why use Method Override?

Because HTML forms cannot send PUT requests directly.

---

### Why pre-fill the form?

It improves user experience by allowing users to edit only the required fields instead of entering all data again.

---

# Quick Revision (30 Seconds)

```
GET /listings/:id/edit
→ Extract ID
→ findById()
→ Render pre-filled edit form

PUT /listings/:id
→ Extract ID
→ findByIdAndUpdate()
→ Save changes
→ Redirect

Edit Flow

Click Edit
↓
GET Route
↓
findById()
↓
Pre-filled Form
↓
User edits
↓
PUT Route
↓
findByIdAndUpdate()
↓
MongoDB Updated
↓
Redirect
```
