# StayNest Part 5 — Authentication & Authorization Notes

> ⭐ Interview Important (Very High)
>
> This module is one of the most important parts of the StayNest project.
> The same authentication & authorization concepts can also be used in my
> VisionAI Smart Stick Dashboard and future MERN projects.

---

# 1. Authentication vs Authorization

These two terms are asked in almost every Node.js interview.

## Authentication (Who are you?)

Authentication means verifying the identity of a user.

Example:
- Login
- Signup
- Passport.js
- Username + Password

Example:

Govind enters

Username:
govind

Password:
********

Passport verifies.

✅ Correct → User logged in

❌ Wrong → Login failed

Authentication answers:

> "Who are you?"

---

## Authorization (What are you allowed to do?)

Authorization happens AFTER Authentication.

It checks whether the logged-in user has permission to perform an action.

Example:

Govind created Listing A.

Karan logs in.

Can Karan edit Govind's listing?

❌ No

Can Govind edit his own listing?

✅ Yes

Authorization answers:

> "What are you allowed to do?"

---

# Interview Difference

Authentication

✔ Verify Identity

Examples

- Login
- Signup
- Passport

Question answered

Who are you?

--------------------------------------

Authorization

✔ Verify Permission

Examples

- isOwner
- isReviewAuthor

Question answered

What are you allowed to do?

---

# 2. Passport.js

Passport.js is an Authentication middleware for Express.

It already provides:

- Login
- Logout
- Session handling
- Password verification

Instead of writing login logic ourselves.

Passport automatically handles:

- Password hashing
- Password verification
- Session creation
- Session validation

---

# 3. Session

After successful login,

Passport creates a Session.

Example

```js
req.session = {
    passport: {
        user: "6878f3d5c8b2..."
    }
}
```

Notice

Session stores

ONLY

User ObjectId

NOT

Entire User Document

Whenever required,

Passport automatically fetches the complete user.

and stores it inside

```js
req.user
```

---

# 4. req.user

After Login

Passport automatically creates

```js
req.user
```

Example

```js
req.user
```

Output

```js
{
   _id : ...
   username : "govind"
   email : "govind@gmail.com"
}
```

Now we can directly write

```js
req.user.username
```

instead of querying MongoDB again.

---

# 5. req.session.redirectUrl

Problem

User clicks

```
/listings/new
```

↓

Not logged in

↓

Redirected to Login

↓

After Login

↓

Normally goes to

```
/listings
```

But user wanted

```
/listings/new
```

Solution

Save

Original URL

before redirecting.

```js
req.session.redirectUrl = req.originalUrl;
```

After successful login

Redirect back

to same page.

---

# Flow

User

↓

Private Page

↓

Not Logged In

↓

Save Original URL

↓

Login Page

↓

Login Success

↓

Redirect back

Original URL

---

# saveRedirectUrl Middleware

Purpose

Copy redirectUrl

from Session

to

res.locals

```js
res.locals.redirectUrl
```

Reason

Password reset

inside Passport

can clear session values.

So we first copy it safely.

---

# 6. isLoggedIn Middleware

Purpose

Protect Private Routes

Example

```
/listings/new
```

```
/reviews
```

```
/edit
```

Logic

If

```js
!req.isAuthenticated()
```

↓

Save URL

↓

Flash Error

↓

Redirect Login

Else

↓

next()

---

# 7. Ownership

Listing

contains

```js
owner
```

Review

contains

```js
author
```

Owner

means

Person who created Listing.

Author

means

Person who wrote Review.

---

# 8. isOwner Middleware

Purpose

Only Listing Owner

can

Edit

Delete

Listing.

Logic

Find Listing

↓

Compare

```js
listing.owner
```

with

```js
req.user._id
```

Same

↓

Allowed

Different

↓

Blocked

---

# Interview Explanation

Authentication

checks

whether user logged in.

Authorization

checks

whether logged-in user

owns the resource.

---

# 9. isReviewAuthor Middleware

Purpose

Only

Review Author

can

Delete

Review.

Logic

Find Review

↓

Compare

```js
review.author
```

with

```js
req.user._id
```

Same

↓

Delete Allowed

Different

↓

Permission Denied

---

# 10. Why both Frontend & Backend checks?

Frontend

Hide Button

```ejs
<% if(review.author._id.equals(currUser._id)){ %>
```

Backend

Security

```js
isReviewAuthor
```

Why both?

Suppose

Someone manually types

```
DELETE
```

request using Postman.

Frontend

cannot stop that.

Backend

always checks permission.

Therefore

Backend Authorization

is the real security.

Frontend

only improves User Experience.

---

# 11. Complete Flow

Signup

↓

Passport hashes password

↓

Store User

↓

Login

↓

Passport verifies password

↓

Session Created

↓

req.user available

↓

User creates Listing

↓

owner = req.user._id

↓

User creates Review

↓

author = req.user._id

↓

User edits Listing

↓

isOwner

↓

Allowed

↓

User deletes Review

↓

isReviewAuthor

↓

Allowed

Else

↓

Permission Denied

---

# 12. Smart Stick Usage

Exactly same logic can be used.

Example

Admin

↓

Can Delete Users

Normal User

↓

Cannot Delete Users

Admin Dashboard

↓

Protected by

Authentication

+

Authorization

Same middleware approach

can be reused.

---

# Interview Story (2-Min Answer)

"In StayNest I implemented complete Authentication using Passport.js and passport-local-mongoose.

Passport handles password hashing, login verification and session management automatically.

After login, Passport stores only the User ObjectId inside the session and automatically provides the complete user through req.user.

I protected private routes using an isLoggedIn middleware.

For Authorization, every Listing stores an owner ObjectId and every Review stores an author ObjectId.

Before editing or deleting, custom middleware like isOwner and isReviewAuthor compares the logged-in user's ObjectId with the stored owner/author ObjectId.

If both match, the action is allowed; otherwise the request is rejected with a flash error.

I also hide Edit/Delete buttons on the frontend, but actual security is enforced on the backend because frontend checks alone can be bypassed."

---

# Revision Keywords

- Passport.js
- Authentication
- Authorization
- Session
- req.user
- req.session
- owner
- author
- isLoggedIn
- isOwner
- isReviewAuthor
- Flash Messages
- redirectUrl
- Passport Session
- Middleware