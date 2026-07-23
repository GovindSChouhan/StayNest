# StayNest Revision Notes (Middleware → wrapAsync → ExpressError → Error Handling → Joi Validation)

---

# 1. What is Middleware?

Middleware is a function that runs **between receiving the request and sending the response**.

It has access to:

- req
- res
- next()

```js
(req, res, next) => {
    // work
    next();
}
```

If middleware does **not** call `next()`, the request stops there.

---

## Flow

```
Client Request
      ↓
Middleware 1
      ↓
Middleware 2
      ↓
Route Handler
      ↓
Response
```

---

## Why use Middleware?

Instead of writing the same code in every route, write it once as middleware.

Examples:

- Authentication
- Validation
- Logging
- Error Handling

---

# 2. next()

`next()` tells Express:

> "My work is finished. Go to the next middleware or route."

Example:

```js
app.use((req, res, next) => {
    console.log("Middleware Running");
    next();
});
```

Without next()

```
Request
    ↓
Middleware
    ↓
STOP
```

With next()

```
Request
    ↓
Middleware
    ↓
Route
    ↓
Response
```

---

# 3. Error Handling in Express

Instead of writing

```js
try{
   ...
}catch(err){
   next(err);
}
```

inside every async route,

we use:

```
wrapAsync()
```

---

# 4. wrapAsync

Location

```
utils/wrapAsync.js
```

Code

```js
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
```

---

## Meaning

wrapAsync automatically catches errors from async functions and forwards them to Express Error Middleware.

Instead of

```js
try{
    ...
}catch(err){
    next(err);
}
```

just write

```js
wrapAsync(async(req,res)=>{
    ...
})
```

---

## Flow

```
Async Route
      ↓
Error occurs
      ↓
.catch(next)
      ↓
Express Error Middleware
```

---

# 5. Applying wrapAsync

Before

```js
app.get("/listings", async(req,res)=>{
    ...
});
```

After

```js
app.get(
    "/listings",
    wrapAsync(async(req,res)=>{
        ...
    })
);
```

Applied on

- Index
- Show
- Create
- Edit
- Update
- Delete

---

# 6. ExpressError

Location

```
utils/ExpressError.js
```

Code

```js
class ExpressError extends Error{

    constructor(statusCode,message){

        super();

        this.statusCode=statusCode;

        this.message=message;
    }

}

module.exports=ExpressError;
```

---

## Why?

JavaScript Error object only stores

```
Error
```

We also need

- status code
- custom message

So we create our own Error Class.

---

Example

```js
throw new ExpressError(404,"Page Not Found");
```

Object becomes

```
statusCode → 404

message → Page Not Found
```

---

# 7. Error Middleware

Must always contain **4 parameters**

```js
(err,req,res,next)
```

Code

```js
app.use((err,req,res,next)=>{

    let{
        statusCode=500,
        message="Something Went Wrong!"
    }=err;

    res.status(statusCode);

    res.render("listings/error.ejs",{message});

});
```

---

## Why app.use()?

Express automatically sends every error here.

---

Flow

```
Route

↓

Error

↓

next(err)

↓

Error Middleware

↓

error.ejs
```

---

# 8. Catch-All Route

Purpose

If user visits a route that doesn't exist.

Example

```
/abc

/listings/xyz/test

/random
```

Code

```js
app.all("/*splat",(req,res,next)=>{

    next(new ExpressError(
        404,
        "Page Not Found!"
    ));

});
```

---

Why at last?

Because Express checks routes from top to bottom.

If no route matches,

Catch-All Route executes.

---

Flow

```
User enters URL

↓

No Route Found

↓

Catch-All Route

↓

ExpressError

↓

Error Middleware

↓

error.ejs
```

---

# 9. error.ejs

Location

```
views/listings/error.ejs
```

Purpose

Display custom error message.

Example

```ejs
<p class="alert-heading">
    <%= message %>
</p>
```

---

# 10. Joi

Purpose

Validate data before saving into MongoDB.

Instead of checking manually

```js
if(!title)

if(!price)

if(!location)
```

Joi checks everything automatically.

---

Install

```
npm i joi
```

---

# 11. Joi Schema

File

```
schema.js
```

Code

```js
const Joi=require("joi");

module.exports.listingSchema=Joi.object({

    listing:Joi.object({

        title:Joi.string().required(),

        description:Joi.string().required(),

        location:Joi.string().required(),

        country:Joi.string().required(),

        price:Joi.number()
                 .required()
                 .min(0),

        image:Joi.string()
                 .allow("",null)

    }).required()

});
```

---

Meaning

```
listing

↓

title → required string

description → required string

location → required string

country → required string

price → number >=0

image → optional
```

---

# 12. Validate Request

```js
let {error}=listingSchema.validate(req.body);
```

Meaning

> "Hey Joi, check whether req.body follows all the rules."

Returns

```
{

value,

error

}
```

If data is correct

```
error

↓

undefined
```

If data is wrong

```
error

↓

ValidationError
```

---

# 13. validateListing Middleware

Instead of validating inside every route,

we create middleware.

```js
const validateListing=(req,res,next)=>{

    let {error}=listingSchema.validate(req.body);

    if(error){

        throw new ExpressError(
            400,
            error.details[0].message
        );

    }

    next();

};
```

---

Meaning

Before route executes,

Joi validates request.

Invalid

↓

ExpressError

↓

Error Middleware

Valid

↓

next()

↓

Route

---

# 14. Using validateListing

POST

```js
app.post(
    "/listings",
    validateListing,
    wrapAsync(async(req,res)=>{

        ...

    })
);
```

PUT

```js
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async(req,res)=>{

        ...

    })
);
```

---

Flow

```
Request

↓

validateListing

↓

Joi Validation

↓

Valid?

↓

YES

↓

wrapAsync

↓

Route

↓

MongoDB

↓

Redirect
```

Invalid

```
Request

↓

validateListing

↓

Joi

↓

Validation Error

↓

ExpressError

↓

Error Middleware

↓

error.ejs
```

---

# 15. Image Conversion (Important)

Edit Form sends

```js
req.body.listing.image

↓

"https://...."
```

But schema expects

```js
image{

filename,

url

}
```

So before update

```js
if(typeof req.body.listing.image==="string"){

    req.body.listing.image={

        filename:"listingimage",

        url:req.body.listing.image

    };

}
```

Flow

```
Edit Form

↓

Image URL String

↓

Convert

↓

Image Object

↓

MongoDB Update
```

---

# Complete Flow

```
User submits Form

↓

validateListing Middleware

↓

Joi validates req.body

↓

Valid ?

↓

NO

↓

ExpressError

↓

Error Middleware

↓

error.ejs



YES

↓

wrapAsync

↓

Route Handler

↓

MongoDB

↓

Redirect
```

---

# Interview One-Liners

### Middleware

> Middleware is a function that executes between receiving a request and sending a response. It can access req, res and next().

---

### wrapAsync

> wrapAsync removes repetitive try-catch blocks by automatically forwarding async errors to Express Error Middleware.

---

### ExpressError

> ExpressError is a custom Error class that stores both statusCode and message.

---

### Error Middleware

> Error Middleware is the central place where all application errors are handled.

---

### Joi

> Joi validates incoming request data before it reaches the database.

---

### validateListing

> validateListing is a middleware that validates req.body using Joi before the route executes.

---

### Catch-All Route

> The Catch-All Route handles every URL that doesn't match any existing route and throws a 404 ExpressError.