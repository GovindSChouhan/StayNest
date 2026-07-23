# EJS + EJS-Mate Revision Notes (StayNest)

---

# 1. What is EJS?

**EJS (Embedded JavaScript)** is a template engine for Express.js.

It allows us to write **JavaScript inside HTML**, making web pages dynamic.

Example:

```ejs
<h1><%= listing.title %></h1>
```

Instead of writing:

```html
<h1>Mountain Retreat</h1>
```

the title comes from the database.

---

# 2. Why use EJS?

Without EJS

```html
<h1>Mountain Retreat</h1>
```

Only one page is possible.

With EJS

```ejs
<h1><%= listing.title %></h1>
```

The same page can display thousands of different listings.

---

# 3. EJS Tags

## `<% %>`

Used to execute JavaScript.

Does NOT print anything.

Example

```ejs
<% for(let listing of allListings){ %>

<% } %>
```

---

## `<%= %>`

Prints a value.

Example

```ejs
<%= listing.title %>
```

Output

```
Mountain Retreat
```

---

## `<%- %>`

Prints HTML without escaping it.

Example

```ejs
<%- body %>
```

Mostly used with **ejs-mate**.

---

# 4. Why use ejs-mate?

Problem:

Every page repeats

- HTML
- Head
- Navbar
- Footer

Solution:

Install

```bash
npm install ejs-mate
```

Configure in app.js

```javascript
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
```

Now EJS supports layouts.

---

# 5. Folder Structure

```
views
│
├── layouts
│      boilerplate.ejs
│
├── listings
│      index.ejs
│      show.ejs
│      edit.ejs
│      new.ejs
```

---

# 6. What is boilerplate.ejs?

It is the common layout shared by every page.

Contains:

- HTML
- Head
- Navbar
- Footer
- CSS Links
- Bootstrap Links

Written only once.

---

# 7. Why use

```ejs
<%- body %>
```

`body` is a placeholder.

Meaning:

> Insert the current page here.

Example

boilerplate.ejs

```ejs
<body>

Navbar

<%- body %>

Footer

</body>
```

index.ejs

```ejs
<h3>All Listings</h3>
```

Final HTML sent to browser

```html
<body>

Navbar

<h3>All Listings</h3>

Footer

</body>
```

---

# 8. Why `<%- body %>` instead of `<%= body %>`?

`body` already contains HTML.

`<%- %>`

→ Render HTML

`<%= %>`

→ Display HTML as plain text

---

# 9. Why

```html
<div class="container">
```

`container` is just a wrapper.

Purpose:

- Keeps all page content inside one box.
- Bootstrap later adds spacing, width and responsiveness.

Example

```ejs
<div class="container">
    <%- body %>
</div>
```

Every page (index, show, edit, new) is inserted inside this container.

---

# 10. Why remove HTML from index.ejs?

Before using ejs-mate

Every page had

```html
<html>
<head>
<body>
```

After using layouts

boilerplate.ejs contains

```html
<html>
<head>
<body>

<%- body %>

</body>
</html>
```

Now index.ejs only contains page-specific content.

Example

```ejs
<% layout("/layouts/boilerplate") %>

<h3>All Listings</h3>
```

No repeated HTML.

---

# 11. Complete Flow

```
Browser
    │
    ▼
GET /listings
    │
    ▼
app.js

res.render("listings/index.ejs")

    │
    ▼
index.ejs

<% layout("/layouts/boilerplate") %>

    │
    ▼
boilerplate.ejs

Navbar

<%- body %>

Footer

    │
    ▼
Browser receives

Navbar

All Listings

Footer
```

---

# Interview Questions

## What is EJS?

EJS is a template engine that allows us to embed JavaScript inside HTML to create dynamic web pages.

---

## Why use EJS?

To display dynamic data received from the server.

---

## Why use ejs-mate?

To support layouts and avoid repeating common HTML code.

---

## What is boilerplate.ejs?

A common layout shared by all pages.

---

## What is `<%- body %>`?

A placeholder where the current page is inserted.

---

## Difference between `<%`, `<%=`, and `<%-`

| Syntax | Purpose |
|---------|----------|
| `<% %>` | Execute JavaScript |
| `<%= %>` | Print value |
| `<%- %>` | Render HTML |

---

# Quick Revision (30 Seconds)

```
EJS = Dynamic HTML

<% %> = Execute JS

<%= %> = Print Value

<%- %> = Render HTML

ejs-mate = Layout Support

boilerplate.ejs = Common Layout

<%- body %> = Insert Current Page

container = Wrapper around page content

index.ejs = Only page-specific content

No repeated HTML after using layouts.
```