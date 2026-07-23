const Joi = require("joi");

// Joi Schema
// This schema validates the incoming req.body before data is saved to MongoDB.
// If any required field is missing or invalid,
// Joi throws an error which is handled by our Express Error Middleware.

module.exports.listingSchema = Joi.object({

    // req.body should contain a "listing" object
    listing: Joi.object({

        // Title must be a string and is required
        title: Joi.string().required(),

        // Description must be a string and is required
        description: Joi.string().required(),

        // Location must be a string and is required
       // location: Joi.string().required(),
       location: Joi.string()
        .pattern(/^[A-Za-z\s,.-]+$/)
        .required()
        .messages({
        "string.pattern.base": "Location should contain only letters."
        }),

        // Country must be a string and is required
       // country: Joi.string().required(),
       country: Joi.string()
        .pattern(/^[A-Za-z\s]+$/)
        .required()
        .messages({
        "string.pattern.base": "Country should contain only letters."
        }),

        // Price must be a number
        // Minimum allowed value = 0
        price: Joi.number().required().min(0),

        // Image URL is optional
        // Empty string ("") and null are also allowed
        image: Joi.string().allow("", null)

    }).required()   // "listing" object itself is required

});

//Review Schema 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});


// Regex Validation
// ^                     -> Start of the input
// [A-Za-z\s,.-]         -> Allow only letters, spaces, commas, dots and hyphens
// +                     -> One or more valid characters are required
// $                     -> End of the input
// Prevents numbers and invalid special characters

// Validate that Location and Country contain only letters.
// HTML <input type="text"> accepts numbers too (e.g. "123"),
// and Joi.string() only checks the data type (string), not the content.
// pattern() ensures users can enter only valid alphabetic names.