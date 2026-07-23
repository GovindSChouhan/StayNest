# StayNest Notes — Part C: Flash Messages (`connect-flash` + `res.locals`)

## What is a Flash Message?

A **Flash Message** is a temporary message shown to the user **only once**, usually after a redirect.

### Examples

* ✅ Listing Created Successfully!
* ✅ Review Added Successfully!
* ❌ Invalid Password
* ❌ Listing Not Found

---

# Why do we need Flash Messages?

Suppose a user creates a new listing.

```text
POST /listings
      ↓
Listing Saved
      ↓
Redirect to /listings
```

After redirect, we want to display:

> **New Listing Created Successfully!**

Flash Messages make this possible.

---

# Required Packages

```bash
npm install express-session
npm install connect-flash
```

---

# Step 1 — Configure Session

```js
const session = require("express-session");

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
```

---

# Step 2 — Enable Flash

```js
const flash = require("connect-flash");

app.use(flash());
```

---

# Step 3 — Store Flash Message

Whenever some action succeeds:

```js
req.flash("success", "New Listing Created Successfully!");
```

or

```js
req.flash("error", "Listing Not Found!");
```

Flash messages are stored inside the **Session**.

---

# Step 4 — Make Flash Available to Every EJS Page

```js
app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
});
```

## Why use `res.locals`?

Without it, every route would need:

```js
res.render("page.ejs", {
    success: req.flash("success")
});
```

With `res.locals`, every EJS page automatically receives:

* `success`
* `error`

No need to pass them manually.

---

# Step 5 — Display Flash Message

```ejs
<% if(success && success.length) { %>

<div class="alert alert-success">

    <%= success %>

</div>

<% } %>
```

Error:

```ejs
<% if(error && error.length) { %>

<div class="alert alert-danger">

    <%= error %>

</div>

<% } %>
```

---

# Complete Flow

```text
Action Happens
      │
      ▼
req.flash("success","Listing Created")
      │
      ▼
Stored in Session
      │
      ▼
res.redirect(...)
      │
      ▼
New Request
      │
      ▼
res.locals.success = req.flash("success")
      │
      ▼
EJS
      │
      ▼
Flash Message Displayed
```

---

# What is `res.locals`?

`res.locals` is a temporary object used to send common data to every EJS page during the current request.

Example:

```js
res.locals.success = req.flash("success");
```

Now every EJS page can directly use:

```ejs
<%= success %>
```

without passing it in every `res.render()`.

---

# Why does `req.flash()` return an Array?

Example:

```js
req.flash("success", "Listing Created!");
req.flash("success", "Review Added!");
```

Now

```js
req.flash("success");
```

returns

```js
[
   "Listing Created!",
   "Review Added!"
]
```

So flash messages are stored as arrays because one category can contain multiple messages.

---

# Two Different "Errors"

## 1. Flash Error

```js
req.flash("error", "Invalid Password");
```

Purpose:

Show a user-friendly message.

Flow:

```text
req.flash()
      ↓
Session
      ↓
res.locals.error
      ↓
EJS
```

---

## 2. Express Error

```js
throw new ExpressError(404, "Listing Not Found");
```

Purpose:

Handle actual application errors.

Flow:

```text
throw Error
      ↓
Error Middleware
      ↓
error.ejs
```

---

# Remember

These are **not the same thing**.

| Flash Error                | Express Error              |
| -------------------------- | -------------------------- |
| User Message               | Real Application Error     |
| `req.flash("error")`       | `throw new ExpressError()` |
| Goes to `res.locals.error` | Goes to Error Middleware   |

---

# Session + Flash Flow

```text
express-session
        ↓
connect-flash
        ↓
req.flash()
        ↓
Session
        ↓
res.locals
        ↓
EJS
        ↓
Browser
```

---

# Interview Definition

### Flash Message

> A Flash Message is a temporary message stored in the session and displayed only once after a redirect.

---

### res.locals

> `res.locals` is a request-specific object that automatically passes common data to all EJS templates rendered during that request.

---

### connect-flash

> `connect-flash` is middleware used to store temporary success or error messages inside the session and display them after a redirect.
