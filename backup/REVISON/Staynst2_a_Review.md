# Review Feature Notes (StayNest)

## Goal

Implement a Review system where:

- One Listing can have many Reviews.
- Each Review belongs to one Listing.

---

# Relationship

One Listing
      │
      │
      ▼
Many Reviews

Listing Schema

```js
reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
]
```

Meaning:

Instead of storing complete Review objects,
the Listing stores only the ObjectIds of Reviews.

---

# Review Schema

```js
const reviewSchema = new Schema({
    comment: String,
    rating: Number,
});
```

Each Review document is stored in the Reviews collection.

---

# Review Form Flow

User fills Review Form

↓

Clicks Submit

↓

POST

```
/listings/:id/reviews
```

↓

Express Route runs

↓

Create new Review

↓

Push Review ObjectId into Listing

↓

Save Review

↓

Save Listing

↓

Redirect back to Show Page

---

# Review POST Route

```js
app.post(
    "/listings/:id/reviews",
    validateReview,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        const listing = await Listing.findById(id);

        const newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();

        await listing.save();

        res.redirect(`/listings/${listing._id}`);

    })
);
```

---

# Why Save Review First?

```
newReview.save()

↓

Review document is created

↓

listing.reviews.push(newReview)

↓

Listing stores Review ObjectId
```

---

# Populate

Without populate()

```
reviews:

[
 ObjectId(...)
]
```

With populate()

```js
Listing.findById(id).populate("reviews")
```

```
reviews:

[
{
comment:"Nice Stay",
rating:5
}
]
```

Populate replaces ObjectIds with complete Review documents.

---

# Delete Review Flow

User clicks Delete

↓

POST request

↓

Method Override

↓

DELETE

```
/listings/:id/reviews/:reviewId
```

↓

Remove Review ObjectId from Listing

↓

Delete Review document

↓

Redirect back

---

# Delete Review Route

```js
app.delete(
"/listings/:id/reviews/:reviewId",
wrapAsync(async(req,res)=>{

let {id,reviewId}=req.params;

await Listing.findByIdAndUpdate(
id,
{
$pull:{
reviews:reviewId
}
}
);

await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`);

})
);
```

---

# MongoDB $pull

Removes a value from an Array.

Example

Before

```
reviews

[
A,
B,
C
]
```

Code

```js
$pull:{
reviews:B
}
```

After

```
reviews

[
A,
C
]
```

---

# Delete Listing Middleware

```js
listingSchema.post(
"findOneAndDelete",
async(listing)=>{

if(listing){

await Review.deleteMany({

_id:{
$in:listing.reviews
}

});

}

}
);
```

Purpose:

When a Listing is deleted,

↓

Delete every Review whose ObjectId is stored inside

```
listing.reviews
```

This prevents orphan Reviews.

---

# Server-side Review Validation (Joi)

```js
reviewSchema = Joi.object({

review:Joi.object({

rating:Joi.number().required(),

comment:Joi.string().required()

}).required()

});
```

Flow

User submits Review

↓

validateReview middleware

↓

Joi validates data

↓

Invalid

↓

ExpressError

↓

Error Page

↓

Valid

↓

POST Route

↓

Save Review

---

# MongoDB Commands

Print all Reviews

```js
db.reviews.find()
```

Pretty format

```js
db.reviews.find().pretty()
```

Count Reviews

```js
db.reviews.countDocuments()
```

Check one Listing

```js
db.listings.findOne(
{title:"Mathur Milan"},
{title:1,reviews:1}
)
```

---

# Interview Summary

- One Listing can have many Reviews.
- Listing stores only Review ObjectIds.
- Reviews are stored in a separate collection.
- populate() fetches complete Review documents.
- $pull removes a Review ObjectId from Listing.
- Review.findByIdAndDelete() deletes the Review document.
- Post middleware automatically deletes all Reviews when a Listing is deleted.
- Joi validates Review data before saving.