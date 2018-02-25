var express = require("express");
var router = express.Router();
var Trail = require("../models/trail");
var middleware = require("../middleware");
// var geocoder = require('geocoder'); // this was the old package that was bound to the var geocoder which you called in the routes
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyCMM7Pfad4zZ9Rdb2FXTZpTBpCi5w4oAYA'    // this is how your api key should be plugged in (as a string). otherwise, you can hide it behind an environmental variable
                                                         // you also want to check your google api key, i was getting an error that it is expired (try to renew it per Ian's instructions)
};

var geocoder = NodeGeocoder(options);     // this is how var geocoder should be defined, with the above options plugged into NodeGeocoder


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
    var desc = req.body.description;
    var distance = req.body.distance;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    console.log("Location", req.body.location);
    geocoder.geocode(req.body.location, function(err, data) {
        if(err || data.status === "ZERO_RESULTS") {
           console.log(err);
           req.flash("error", "Invalid address - try typing a new location");
           return res.redirect("back");
       }

        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newTrail = {name: name, image: image, description: desc, distance: distance, author: author, location: location, lat: lat, lng: lng};
        //Create a new trail and save to DB
        Trail.create(newTrail, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //Redirect back to trails page
            res.redirect("/trails");
        }
    });
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
            console.log(err);
        } else {
            console.log(foundTrail);
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
    geocoder.geocode(req.body.location, function(err, data) {
        if(err || data.status === "ZERO_RESULTS") {
            console.log(err);
            req.flash("error", "Invalid address - try typing a new location");
            return res.redirect("back");
       }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, distance: req.body.distance, location: location, lat: lat, lng: lng};
        Trail.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, trail) {
            if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/trails/" + trail._id);
        }
    });
    });
});

//DESTROY TRAIL ROUTE
router.delete("/:id", middleware.checkTrailOwnership, function(req, res) {
    Trail.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/trails");
        }
    });
});

module.exports = router;