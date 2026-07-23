
# StayNest Revision Notes – Part 4
# Authentication & Authorization (Passport.js)

> Goal: Understand the **concepts**, not just memorize the code.

---

# 1. Authentication vs Authorization

## Authentication = "Who are you?"

Authentication verifies a user's identity.

Example:
- Username + Password
- Google Login
- GitHub Login

If the credentials are correct, the user is authenticated.

---

## Authorization = "What are you allowed to do?"

Authorization checks permissions **after** authentication.

Example:

- Guest → Can view listings.
- Logged-in User → Can create listings.
- Listing Owner → Can edit/delete only their own listing.

---

## Easy Memory

- Authentication → Identity
- Authorization → Permission

---

# 2. Packages Used

## passport

Main authentication library.

Responsibilities:
- Login
- Logout
- Sessions
- req.user
- req.isAuthenticated()

---

## passport-local

Implements the Local Strategy.

Local Strategy = Username + Password authentication.

---

## passport-local-mongoose

A Mongoose plugin.

Instead of writing hashing logic manually, it automatically adds:

- username field
- hash field
- salt field

Methods:

- register()
- authenticate()
- serializeUser()
- deserializeUser()

---

## express-session

Creates a session after login.

Without sessions, users would need to login on every request.

---

## connect-flash

Stores temporary messages.

Examples:

- Login Successful
- Invalid Password
- Listing Created

Flash messages disappear after one request.

---

# 3. Why Password Is Not Stored

Never save:

```
password: "hello123"
```

Instead Passport Local Mongoose stores:

```
username
email
hash
salt
```

Password

↓

Hash

↓

Stored in DB

Hashing is one-way.

---

# 4. Signup Flow

```
GET /signup

↓

Render signup form

↓

User fills form

↓

POST /signup

↓

req.body

↓

Create User object

↓

User.register()

↓

Password hashed

↓

User saved

↓

Flash message

↓

Redirect
```

Example:

```js
let { username, email, password } = req.body;

const newUser = new User({
    username,
    email
});

await User.register(newUser, password);
```

Explanation:

Destructuring:

```js
let { username, email } = req.body;
```

is shorthand for

```js
let username = req.body.username;
let email = req.body.email;
```

Property shorthand:

```js
{
    username,
    email
}
```

equals

```js
{
    username: username,
    email: email
}
```

---

# 5. Login Flow

```
GET /login

↓

Render login page

↓

POST /login

↓

passport.authenticate("local")

↓

Find username

↓

Compare password hash

↓

Success?

YES

↓

Create session

↓

serializeUser()

↓

Redirect

NO

↓

failureFlash

↓

failureRedirect
```

Route:

```js
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req,res)=>{
        res.redirect("/listings");
    }
);
```

---

# 6. Local Strategy

Configured once:

```js
passport.use(
    new LocalStrategy(User.authenticate())
);
```

Meaning:

"When login happens, use User.authenticate() to verify username and password."

---

# 7. Sessions

Without session

```
Every request

↓

Login again
```

With session

```
Login once

↓

Session created

↓

Browser stores session cookie

↓

Future requests include cookie

↓

User remains logged in
```

---

# 8. Session Middleware

```js
app.use(session(sessionOptions));
```

Important options

## secret

Signs the cookie.

## resave

Usually false.

Don't save unchanged sessions.

## saveUninitialized

Usually true while learning.

## cookie.maxAge

How long login remains valid.

## httpOnly

JavaScript cannot read cookie.

Protection against XSS.

---

# 9. Passport Middleware

```js
app.use(passport.initialize());
```

Starts Passport.

---

```js
app.use(passport.session());
```

Allows Passport to use express-session.

Without this, login is forgotten after every request.

---

# 10. serializeUser()

```js
passport.serializeUser(User.serializeUser());
```

Stores only User ID in session.

Example

```
Session

↓

User ID
```

NOT the whole user.

Memory:

Store User ID after login.

---

# 11. deserializeUser()

```js
passport.deserializeUser(User.deserializeUser());
```

Uses stored ID.

Fetches complete user from MongoDB.

Creates

```js
req.user
```

Memory:

Read User from DB using stored ID.

---

# 12. req.user

Available only after login.

Contains logged-in user's document.

Example

```js
console.log(req.user.username);
```

---

# 13. req.isAuthenticated()

Checks whether current request belongs to a logged-in user.

Returns

```
true
```

or

```
false
```

Middleware example

```js
if(!req.isAuthenticated()){
    req.flash("error","Login first");
    return res.redirect("/login");
}
next();
```

---

# 14. Flash Messages

```
req.flash()

↓

Session

↓

res.locals

↓

flash.ejs

↓

Displayed once

↓

Removed
```

---

# 15. Folder Responsibilities

```
routes/
```

Logic

```
models/
```

Database

```
views/
```

UI

```
public/
```

CSS JS Images

---

# 16. Common Errors

### await is only valid in async

Forgot async.

### route is not defined

Use router not route.

### Page Not Found /login

GET /login missing.

### First param to schema.plugin()

Plugin imported incorrectly.

### Flash appears twice

Rendered body twice.

---

# 17. Interview Questions

Q. Difference between Authentication and Authorization?

Authentication verifies identity.

Authorization checks permissions.

---

Q. Why Passport?

Provides ready-made authentication.

---

Q. Why passport-local-mongoose?

Automatically hashes passwords and provides helper methods.

---

Q. Why sessions?

Remember logged-in users.

---

Q. Why serializeUser()?

Store only User ID.

---

Q. Why deserializeUser()?

Fetch full user using stored ID and make it available as req.user.

---

# 18. 5-Minute Revision

- Authentication = Verify identity
- Authorization = Check permission
- passport = Authentication library
- passport-local = Username + Password strategy
- passport-local-mongoose = Hashing + helper methods
- express-session = Remember login
- connect-flash = Temporary messages
- User.register() = Hash + Save user
- passport.authenticate("local") = Verify credentials
- serializeUser() = Store ID in session
- deserializeUser() = Load user into req.user
- req.user = Logged-in user
- req.isAuthenticated() = true/false login check
