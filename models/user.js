const mongoose = require("mongoose");

// Extract Schema class from Mongoose
const Schema = mongoose.Schema;

// Mongoose plugin that adds authentication features
// (username, password hashing, salt, register(), authenticate(), etc.)
const passportLocalMongoose = require("passport-local-mongoose").default;

// User Schema (Blueprint)
const userSchema = new Schema({

    // Email field
    // (username & password are automatically added by the plugin)
    email: {
        type: String,
        required: true,
    },

});

// Attach passport-local-mongoose plugin to the schema.
// It automatically adds:
// • username field
// • hash field
// • salt field
// • register()
// • authenticate()
// • serializeUser()
// • deserializeUser()
userSchema.plugin(passportLocalMongoose);

// Export User model
module.exports = mongoose.model("User", userSchema);