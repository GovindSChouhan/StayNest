# MVC Architecture (StayNest Notes)

---

# What is MVC?

MVC (Model-View-Controller) is a software design pattern that separates an application into three parts:

- **Model** → Handles Database
- **View** → Handles User Interface
- **Controller** → Handles Business Logic

This separation makes the code clean, reusable, and easy to maintain.

---

# MVC Structure

```
Project
│
├── models/
├── views/
├── controllers/
├── routes/
├── middleware.js
└── app.js
```

---

# 1. Model

### Purpose

Responsible for interacting with MongoDB.

### Work

- Create Schema
- Store Data
- Update Data
- Delete Data
- Fetch Data

### Example

```js
const Listing = require("../models/listing");
```

Examples

```
listing.js
review.js
user.js
```

Model never renders pages.

---

# 2. View

### Purpose

Responsible for displaying data to users.

Contains

- HTML
- Bootstrap
- EJS

Example

```ejs
<%= listing.title %>
```

Views never access MongoDB.

---

# 3. Controller

### Purpose

Contains all business logic.

Work

- Fetch Data
- Save Data
- Delete Data
- Update Data
- Flash Messages
- Redirect

Example

```js
module.exports.createListing = async(req,res)=>{
   ...
}
```

Controllers never define URLs.

---

# 4. Routes

### Purpose

Defines application URLs.

Example

```js
router.get(
"/",
listingController.index
);
```

Routes receive requests and forward them to controllers.

Routes should contain **minimum logic**.

---

# MVC Flow

```
Browser

↓

Route

↓

Controller

↓

Model

↓

MongoDB

↓

Controller

↓

View

↓

Browser
```

---

# Example (Create Listing)

```
POST /listings

↓

listing_mvc.js

↓

listingController.createListing()

↓

Listing Model

↓

MongoDB

↓

Redirect
```

---

# Example (Delete Review)

```
DELETE

↓

review_mvc.js

↓

reviewController.destroyReview()

↓

Review Model

↓

MongoDB

↓

Redirect
```

---

# Why MVC?

Without MVC

```
Routes

↓

Business Logic

↓

Database

↓

Response
```

Everything stays in one file.

Large projects become difficult to manage.

---

With MVC

```
Routes

↓

Controllers

↓

Models

↓

Views
```

Each file has only one responsibility.

---

# Advantages

✔ Clean Code

✔ Easy Debugging

✔ Better Maintenance

✔ Reusable Code

✔ Easy Teamwork

✔ Scalable Project

✔ Industry Standard

---

# What I Changed in StayNest

Created

```
controllers/

listings.js

reviews.js

users.js
```

Created MVC Routes

```
listing_mvc.js

review_mvc.js

user_mvc.js
```

Moved

- Database logic
- Flash messages
- Redirect logic

from Routes → Controllers.

Routes now only define URLs.

---

# Difference

### Route

Receives request.

Example

```js
router.post("/", listingController.createListing);
```

---

### Controller

Contains business logic.

Example

```js
Listing.findById()
Listing.save()
res.redirect()
```

---

### Model

Interacts with MongoDB.

Example

```js
Listing.find()
```

---

### View

Displays data.

Example

```ejs
<%= listing.title %>
```

---

# Interview Answer (30 sec)

MVC separates an application into Models, Views, and Controllers. Models manage database operations, Views handle the user interface, and Controllers contain business logic. In my StayNest project, I moved all business logic from route files into separate controller files, making the project cleaner, modular, reusable, and easier to maintain.

---

# Resume Point

**Implemented MVC (Model-View-Controller) architecture by separating routes, controllers, models, and views, resulting in a modular, maintainable, and scalable Express.js application.**