# 🍪 Cookies, cookie-parser & Signed Cookies (Express.js Notes)

---

# 1. Cookies

## What is a Cookie?

A **cookie** is a **small piece of data** stored in the **user's browser** by the **server**.

It helps the server remember information about the user across multiple requests.

---

## Why do we need Cookies?

HTTP is **Stateless**.

That means:

```
Request 1
↓
Server responds
↓
Connection ends

Request 2
↓
Server DOES NOT remember Request 1
```

So we use **Cookies** to remember users.

---

## Common Uses

- Login Authentication
- Shopping Cart
- Remember User
- Dark / Light Theme
- Language Preference
- Session Management

---

## How Cookies Work

```
Browser
      │
      │ Request
      ▼
Server

res.cookie("name", "Govind")

      │
      ▼
Browser stores Cookie

name = Govind
```

Next Request

```
Browser
      │
Cookie : name=Govind
      │
      ▼
Server
```

Browser automatically sends cookies with every request.

---

## Set Cookie

```js
res.cookie("name", "Govind");
```

### Syntax

```js
res.cookie(key, value);
```

Example

```js
res.cookie("country", "India");
res.cookie("city", "Indore");
```

---

## Cookie Options

```js
res.cookie("name", "Govind", {
    maxAge: 1000 * 60 * 60,
    httpOnly: true
});
```

### Common Options

| Option | Purpose |
|---------|----------|
| maxAge | Cookie expiry time |
| expires | Expiry Date |
| httpOnly | JavaScript cannot access cookie |
| signed | Creates signed cookie |

---

# 2. cookie-parser

## What is cookie-parser?

`cookie-parser` is an **Express Middleware**.

It reads (parses) cookies sent by the browser and makes them available inside:

```js
req.cookies
```

Without cookie-parser

```js
req.cookies
```

Output

```js
undefined
```

With cookie-parser

```js
req.cookies
```

Output

```js
{
   name: "Govind"
}
```

---

## Installation

```bash
npm install cookie-parser
```

---

## Require

```js
const cookieParser = require("cookie-parser");
```

---

## Use Middleware

```js
app.use(cookieParser());
```

---

## Reading Cookies

```js
app.get("/getcookies", (req, res) => {

    console.log(req.cookies);

    res.send(req.cookies);

});
```

Output

```js
{
    name: "Govind"
}
```

---

## Flow

```
Server
     │
res.cookie()
     │
     ▼
Browser stores Cookie
     │
     ▼
Browser sends Cookie
     │
     ▼
cookie-parser
     │
     ▼
req.cookies
```

---

# 3. Signed Cookies

## Problem

Normal Cookies can be modified by the user.

Example

```
name = Govind
```

User can change it to

```
name = Rahul
```

Server cannot know whether it was modified.

---

## Solution

Use **Signed Cookies**.

Signed Cookies contain a **digital signature**.

If someone changes the cookie,

Express immediately knows it has been modified.

---

## Configure cookie-parser

```js
app.use(cookieParser("mysecretcode"));
```

"mysecretcode" is called the **Secret Key**.

---

## Create Signed Cookie

```js
res.cookie("name", "Govind", {
    signed: true
});
```

---

## Read Signed Cookie

```js
req.signedCookies
```

Example

```js
console.log(req.signedCookies);
```

Output

```js
{
    name: "Govind"
}
```

---

## Flow

```
Server

res.cookie("name","Govind",{
    signed:true
})

        │
        ▼

Browser stores Cookie + Signature

        │
        ▼

Browser sends Cookie

        │
        ▼

Express verifies Signature

        │
        ▼

Valid
↓

req.signedCookies

OR

Invalid
↓

Cookie Rejected
```

---

# Normal Cookie vs Signed Cookie

| Normal Cookie | Signed Cookie |
|---------------|---------------|
| Can be modified | Modification detected |
| Stored in browser | Stored in browser |
| Read using req.cookies | Read using req.signedCookies |
| No security | Better integrity |

---

# Interview Questions

## What is a Cookie?

A cookie is a small piece of data stored in the user's browser by the server to remember information across multiple requests.

---

## Why do we use Cookies?

- Login
- Shopping Cart
- User Preferences
- Session Management

---

## What is cookie-parser?

An Express middleware that parses cookies sent by the browser and makes them available using:

```js
req.cookies
```

---

## What are Signed Cookies?

Signed Cookies are cookies protected with a secret key.

If someone modifies them, Express detects the change and treats the cookie as invalid.

---

# Quick Revision

## Cookie

```js
res.cookie("name","Govind");
```

↓

Browser stores cookie

↓

Browser sends cookie automatically

---

## cookie-parser

Install

```bash
npm i cookie-parser
```

Use

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

Read

```js
req.cookies
```

---

## Signed Cookie

Create

```js
res.cookie("name","Govind",{
    signed:true
});
```

Read

```js
req.signedCookies
```

Setup

```js
app.use(cookieParser("secret"));
```

---

# One-Line Revision

- **Cookie:** Small data stored in the browser by the server.
- **cookie-parser:** Middleware that reads cookies and stores them in `req.cookies`.
- **Signed Cookie:** A cookie protected with a secret key so users cannot tamper with it without detection.