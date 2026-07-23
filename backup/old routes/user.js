//"What should happen when a user visits a URL?"
const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync");
//require passport
const passport = require("passport");
//Import only the saveRedirectUrl middleware function from middleware.js
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup",(req, res) => {
    res.render("users/signup.ejs");

});
// Signup
router.post("/signup",wrapAsync(async(req, res) => {
    try{
    let{username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    //Log in after Sign-up Auto.
    req.login(registeredUser, (err) =>{
        if(err) {
            return next(err);
        }
       req.flash("success", "Welcome to the StayNest!"); 
       res.redirect("/listings");
    })
    
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// =====================================================
// LOGIN PAGE
// GET /login
// Render Login Form
// =====================================================
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
//For login 
// router.post(
//     "/login",
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     async (req, res) => {
//         req.flash("success", "Welcome back!");
//         res.redirect("/listings");
//     }

// );
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        console.log("LOGIN SUCCESS");
        console.log(req.user);

        req.flash("success", "Welcome back to StayNest!");

        //req.session.redirectUrl redirect to same path after login
        //for this make another local so taht password cant reset it 
        //plus login -to /listing honey k liye we check condn that 
        //redirectUrl is empty or not .
        let redirectUrl = res.locals.redirectUrl ||"/listings";
        res.redirect(redirectUrl);
    }
);
//USER LOGOUT LOGIC .passportjs.org
router.get("/logout",(req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);

        }

        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });




});
module.exports = router;

// POST /login
//         │
//         ▼
// passport.authenticate("local", {...})
//         │
//         ├── ❌ Login fails
//         │      │
//         │      ├── Flash error
//         │      └── Redirect to /login
//         │
//         └── ✅ Login succeeds
//                │
//                ▼
//         async (req, res) => {
//             req.flash(...);
//             res.redirect(...);
//         }


