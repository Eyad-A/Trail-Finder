var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

//AUTH ROUTES

//REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//REGISTER POST ROUTE
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {"error":err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to TrailFinder " + user.username);
            res.redirect("/trails");
        });
    });
});

//LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

//LOGIN POST ROUTE
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/trails",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are now logged out");
    res.redirect("/trails");
});

module.exports = router;