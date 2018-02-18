var express = require("express");
var router = express.Router();
var Trail = require("../models/trail");

//INDEX
router.get("/", function(req, res) {
    //Get all trails from DB
    Trail.find({}, function(err, allTrails) {
        if (err) {
            console.log(err);
        } else {
             res.render("trails/index", {trails: allTrails});
        }
    });
});

//CREATE
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newTrail = {name: name, image: image, description: desc, author: author};
    //Create a new trail and save to DB
    Trail.create(newTrail, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //Redirect back to trails page
            console.log("=============");
            console.log(newlyCreated);
            res.redirect("/trails");
        }
    });
});

//NEW
router.get("/new", isLoggedIn,  function(req, res) {
    res.render("trails/new");
});

//SHOW
router.get("/:id", function(req, res) {
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundTrail);
            res.render("trails/show", {trail: foundTrail});
        }
    });
});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;