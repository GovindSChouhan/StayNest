# Express Session Notes

## Why do we need Sessions?

HTTP is **Stateless**.

After sending a response, the server forgets the user.

A **Session** allows the server to remember data between requests.

---

## Install

```bash
npm install express-session
```

---

## Import

```js
const session = require("express-session");
```

Imports Express Session middleware.

---

## Session Configuration

```js
const sessionOptions = {
    secret: "MySupersecretString",
    resave: false,
    saveUninitialized: true,
};
```

### secret

Used to sign the session cookie.

Prevents cookie tampering.

### resave: false

Don't save the session again if nothing changed.

### saveUninitialized: true

Save a newly created session even if it is empty.

---

## Enable Session Middleware

```js
app.use(session(sessionOptions));
```

Creates `req.session` for every request.

---

## Store Data

```js
req.session.name = "Govind";
```

Stores data inside the current user's session.

---

## Read Data

```js
req.session.name
```

Reads previously stored session data.

---

## Example

### Store

```js
app.get("/register",(req,res)=>{

    let {name="anonymous"} = req.query;

    req.session.name = name;

    res.send(name);

});
```

Visit

```
http://localhost:3000/register?name=Govind
```

Session becomes

```js
{
    name:"Govind"
}
```

---

### Read

```js
app.get("/hello",(req,res)=>{

    res.send(`Hello ${req.session.name}`);

});
```

Output

```
Hello Govind
```

---

## Session Flow

Browser

↓

GET /register?name=Govind

↓

req.session.name = "Govind"

↓

Server stores Session

↓

Browser receives Cookie (`connect.sid`)

↓

Later

↓

GET /hello

↓

Browser sends same Cookie

↓

Server finds Session

↓

Hello Govind

---

## Cookie vs Session

### Cookie

Stored in Browser.

Contains only:

```
connect.sid
```

### Session

Stored on Server.

Contains actual data.

```js
{
    name:"Govind"
}
```

---

## Interview Definition

**Session** is a server-side storage mechanism that allows Express to remember user data across multiple HTTP requests using a unique Session ID stored in the browser cookie (`connect.sid`).