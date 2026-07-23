console.log("🔥 I AM RUNNING SESSION.JS");

const express = require("express");
const app = express();

// express-session middleware creates a session for each user
// and stores session data across multiple requests.
const session = require("express-session");
const flash = require("connect-flash");

// To use EJS
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "MySupersecretString",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));

// To use flash
app.use(flash());

app.get("/register", (req, res) => {

    let { name = "anonymous" } = req.query;
    req.session.name = name;

    if(name == "anonymous"){
        req.flash("error" , " user not register yet");
    }else{

        req.flash("sucess", "user register successfull");     
    }
    // Flash Message
    //req.flash("success", "User Registered Successfully!");
    //console.log(req.session);
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
//localy store instead of one one message 
    res.locals.successMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error")
    res.render("page.ejs", {
        name: req.session.name,
        msg: req.flash("success"),
       
    });

});

// Count how many times request came
// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//     req.session.name = "Govind";
//     res.send("Test Successful");
// });

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
