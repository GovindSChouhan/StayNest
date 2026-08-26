const express = require("express");
const app = express();

app.use((req, res, next) => {
   let {token} = req.query;    
   if(token === "giveaccess"){
     next();
   }
   res.send("acess Denied");

});
app.get("/api" , (req, res) => {
    res.send("data");
});

app.listen(8080, () => {
    console.log("Server listening on port 8080");
});
