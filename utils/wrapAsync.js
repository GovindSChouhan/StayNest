// wrapAsync ek Higher Order Function (HOF) hai.
// Ye kisi bhi async route function ko wrap karta hai.
//
// Problem:
// Async route me error aane par baar-baar try...catch likhna padta hai.
//
// Solution:
// wrapAsync automatically async errors ko catch karke
// Express ke error-handling middleware (next) ko bhej deta hai.
//
// Isse code clean, reusable aur readable ban jata hai.

module.exports = (fn) => {//This whole function becomes fn.
    return (req, res, next) => {//Call the original async function.
        fn(req, res, next).catch(next);//ager promise reject autp send to exp error middl
    };
};


