# 📌 StayNest – Show Route (GET /listings/:id)

## Purpose

Display the details of **one specific listing**.

---

# Flow

```text
Browser
      │
GET /listings/:id
      │
      ▼
Express Route
      │
      ▼
req.params.id
      │
      ▼
Listing.findById(id)
      │
      ▼
MongoDB
(Returns one document)
      │
      ▼
res.render("listings/show", { listing })
      │
      ▼
show.ejs
```

---

# Route

```javascript
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/show", { listing });
});
```

---

# Key Points

### `:id`

Dynamic Route Parameter.

Example URL:

```text
/listings/686f3d9a7e1b45b8d5f8a123
```

The value after `/listings/` is stored in:

```javascript
req.params.id
```

---

### Destructuring

```javascript
let { id } = req.params;
```

Same as

```javascript
let id = req.params.id;
```

Destructuring makes the code shorter and cleaner.

---

### `Listing.findById(id)`

Fetches **one document** whose `_id` matches the given `id`.

Returns:

```javascript
{
   title: "...",
   price: 1500,
   location: "...",
   country: "..."
}
```

Unlike `find()`, it returns **one object**, not an array.

---

### `await`

Waits until MongoDB returns the document.

---

### `res.render("listings/show", { listing })`

Renders:

```text
views/
   └── listings/
          show.ejs
```

Passes the variable `listing` to the EJS page.

Object shorthand:

```javascript
{ listing }
```

is the same as

```javascript
{ listing: listing }
```

---

# EJS

Display data:

```ejs
<h3><%= listing.title %></h3>

<p><%= listing.description %></p>

<p>₹ <%= listing.price.toLocaleString("en-IN") %></p>

<p><%= listing.location %></p>

<p><%= listing.country %></p>
```

---

# Difference

## Index Route

```javascript
Listing.find({})
```

Returns

```javascript
[
   {...},
   {...},
   {...}
]
```

Many documents (Array)

Variable:

```javascript
allListings
```

---

## Show Route

```javascript
Listing.findById(id)
```

Returns

```javascript
{...}
```

One document (Object)

Variable:

```javascript
listing
```

---

# Common Mistakes

### Wrong View Path

❌

```javascript
res.render("listing/show");
```

✅

```javascript
res.render("listings/show");
```

---

### Forgetting `await`

Without `await`, `listing` will be a Promise instead of the document.

---

### Typo

❌

```ejs
listing.price.tolocalString()
```

✅

```ejs
listing.price.toLocaleString("en-IN")
```

---

### Wrong Route Parameter

❌

```javascript
req.param.id
```

✅

```javascript
req.params.id
```

---

# Interview Questions

### Q1. Why use `findById()` instead of `find()`?

`findById()` searches using the document's `_id` and returns a single document.

`find()` returns an array of matching documents.

---

### Q2. What is `req.params`?

`req.params` contains values from dynamic route parameters.

Example:

```text
/listings/12345
```

Then

```javascript
req.params.id
```

returns

```text
12345
```

---

### Q3. Why is the variable named `listing`?

Because `findById()` returns one document.

For multiple documents (`find()`), we use `allListings`.

---

### Q4. Why use `toLocaleString("en-IN")`?

To format the price according to the Indian numbering system.

Example:

```text
2500000
```

↓

```text
25,00,000
```

---

# 30-Second Revision

* GET `/listings/:id`
* `:id` → Dynamic route parameter.
* `req.params.id` → Extract the ID from the URL.
* `findById(id)` → Fetch one document.
* Returns an object (`listing`).
* `res.render("listings/show")` → Opens `show.ejs`.
* Use `toLocaleString("en-IN")` to format prices.
* `find()` → Many documents (Array).
* `findById()` → One document (Object).
