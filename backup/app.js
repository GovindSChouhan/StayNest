console.log("🔥 I AM RUNNING APP.JS");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//module.exports: model ko project ki baaki files tak pahunchata hai.
const Listing = require("./models/listing");

//Method overr-ride
const methodOverride = require("method-override");

//For boilerPlate eejsMATE
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

//for WrapAsync 
const wrapAsync = require("./utils/wrapAsync.js");
//for ExpressError
const ExpressError = require("./utils/ExpressError.js");

//For Joi validations
const{listingSchema, reviewSchema} = require("./schema.js");
//for review
const Review = require("./models/review.js");



//for ejs require a path
const path = require("path");
//const Listing = require("./models/listing");

app.set("view engine", "ejs");//Which template engine to use.
app.set("views", path.join(__dirname, "views"));//Where the views folder is.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));//get post
app.use(express.static(path.join(__dirname, "/public")));//location of css public


main()
    .then((res) => {
        console.log("Connection Successful");
    }).catch((err) => {
        console.log(err);
    });

async function main() {//Server set up cource can refer Documentation
    await mongoose.connect('mongodb://127.0.0.1:27017/stayNest');
}

app.get("/" , (req, res) =>  {
    res.send("govind , the root peimnted");
});

//Validation for Schema 
// Validation Middleware
// Before reaching the route, Joi checks whether req.body
// follows the rules defined in listingSchema.

const validateListing = (req, res, next) => {

    // Validate req.body using Joi
    let { error } = listingSchema.validate(req.body);
    // If validation fails, throw custom Express Error
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }else {

    // If validation passes, move to the next middleware/route
    next();
    }
};
//Review Validation 
const validateReview= (req, res, next) => {

    // Validate req.body using Joi
    let { error } = reviewSchema.validate(req.body);
    // If validation fails, throw custom Express Error
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errMsg);
    }else {

    // If validation passes, move to the next middleware/route
    next();
    }
};



//1.Index Route_GET :: return all listing 
app.get("/listings", wrapAsync(async (req, res) => {
    console.log("✅ /listings route recieved");

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
}));
//3 . New Route : get plus Post
app.get("/listings/new", (req, res) => {//is /new ko db mai search karega iso phaly other id ,new confuse
    res.render("listings/new.ejs");
});

//2.SHOW_Read ROUTE-- Return all id info
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate("reviews");//

    res.render("listings/show.ejs", { listing });
}));


// let { title, description, image, price, location, country } = req.body;

// let newListing = new Listing({
//     title,
//     description,
//     image,
//     price,
//     location,
//     country
// });

// 4.Create : (new , create )Route --so info add hohi vo iss route pr show 
// this async as db mai change karengy they code change hai thodasa to handle custom error

app.post("/listings",validateListing, wrapAsync(async (req, res) => {

    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for Listing");
    // }
    //"Hey Joi, check whether req.body follows the rules defined in listingSchema.
    

    const newListing = new Listing(req.body.listing);
    // Schema Validations
    // if(!newListing.description){
    //     throw new ExpressError(400, "Description is missing");
    // }

    
   
    await newListing.save();
    res.redirect("/listings");

}));


    // try{ old code 
    //     const newListing = new Listing(req.body.listing);
    //     await newListing.save();
    //     res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }
 //let {title, description ,image , price, location} = req.body;
 //let listing = req.body.listing;
 //const newListing = new Listing(req.body.listing);
 //Creates a new Mongoose document using the form data (req.body.listing).
//Not saved to MongoDB yet.

 //await newListing.save();
 //Saves the new document permanently into the MongoDB database.
 //await waits until the save operation completes.
// res.redirect("/listings");
 //edirects the browser to GET /listings after saving.

//});

// app.post("/listings", async (req, res) => {

//     console.log("req.body =", req.body);
//     console.log("req.body.listing =", req.body.listing);

//     const newListing = new Listing(req.body.listing);

//     await newListing.save();

//     res.redirect("/listings");
// });

//4. EDIT routr :(get and put )
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });

}));

//4. Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;

//     Edit Form
//       ↓
// Image received as String
//       ↓
// Schema expects Object
//       ↓
// Convert String → Object
//       ↓
// MongoDB Update
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            filename: "listingimage",
            url: req.body.listing.image,
        };
    }

    await Listing.findByIdAndUpdate(id, req.body.listing);

    res.redirect("/listings");

}));



// app.put("/listings/:id", async(req, res) => {
//     let {id} = req.params;//id extract 
//    await Listing.findByIdAndUpdate(id, {...req.body.listing});//extract Listing
//    res.redirect("/listings");
// })

//Delete Route 
app.delete("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);

    console.log(deletedListing);

    res.redirect("/listings");

}));

//Review Route : POST Route
// POST Route : Create a New Review
// Flow:
// 1. Extract Listing ID from URL
// 2. Find that Listing
// 3. Create a new Review using form data
// 4. Save the Review in Reviews Collection
// 5. Push Review's ObjectId into Listing.reviews[]
// 6. Save the updated Listing
// 7. Send response / Redirect

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {

    // Extract Listing ID from URL
    let { id } = req.params;

    // Find the corresponding Listing
    const listing = await Listing.findById(id);
    // Create a new Review using form data
    const newReview = new Review(req.body.review);
    // Add Review's ObjectId into Listing's reviews array
    listing.reviews.push(newReview);
    // Save Review document first
    await newReview.save();
    // Save updated Listing document
    await listing.save();

    //console.log("New Review Saved");

    res.redirect(`/listings/${listing._id}`);

}));

//Delelte Review Route
// Delete Review Route
// Deletes a review and removes its reference from the corresponding Listing
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {

    // Extract Listing ID and Review ID
    let { id, reviewId } = req.params;

    // Remove Review ID from Listing's reviews array
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete Review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect back to Show Page
    res.redirect(`/listings/${id}`);

}));
//new_Route
// app.get("/testListing", async(req, res) => {
//    let sampleListing = new Listing({
//     title : "My new Villa",
//     description: "new Beach",
//     price : 1200,
//     location : "brijNivas , indore",
//     country : "India",
//    });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("SuccessFull Testing");
// });

//This is called the Catch-All Route because it catches every request that didn't match any route above it.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

//ExpressError
// Custom Error Handling .Notes refer for infi
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
  //  res.status(statusCode).send(message);
  //  res.send("Somethinf went wrong!")
}); 


app.listen(8080, () => {
    console.log("server is listening to post 8080");

})
