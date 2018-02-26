var express = require("express");
var router = express.Router();
var Trail = require("../models/trail");
var middleware = require("../middleware");

//INDEX
router.get("/", function(req, res) {
    //Get all trails from DB
    Trail.find({}, function(err, allTrails) {
        if (err) {
            console.log(err);
        } else {
             res.render("trails/index", {trails: allTrails, page: 'trails'});
        }
    });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var location = req.body.location;
    var distance = req.body.distance;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newTrail = {name: name, image: image, location: location, distance: distance, author: author};
    //Create a new trail and save to DB
    Trail.create(newTrail, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            //Redirect back to trails page
            req.flash("success", "new trail has been created");
            res.redirect("/trails");
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    res.render("trails/new");
});

//SHOW
router.get("/:id", function(req, res) {
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            res.render("trails/show", {trail: foundTrail});
        }
    });
});

//EDIT TRAIL ROUTE
router.get("/:id/edit", middleware.checkTrailOwnership, function(req, res) {
    Trail.findById(req.params.id, function(err, foundTrail) {
        res.render("trails/edit", {trail: foundTrail});
    });
});

//UPDATE TRAIL ROUTE
router.put("/:id", middleware.checkTrailOwnership, function(req, res) {
    Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
        } else {
            req.flash("success", "Updated successfully!");
            res.redirect("/trails/" + req.params.id);
        }
    });
});

//DESTROY TRAIL ROUTE
router.delete("/:id", middleware.checkTrailOwnership, function(req, res) {
    Trail.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            req.flash("success", "Deletion was successful!");
            res.redirect("/trails");
        }
    });
});

module.exports = router;