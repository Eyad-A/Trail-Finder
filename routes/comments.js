var express = require("express");
var router = express.Router({mergeParams: true});
var Trail = require("../models/trail");
var Comment = require("../models/comment");

//NEW COMMENTS
router.get("/new", isLoggedIn, function(req, res) {
    Trail.findById(req.params.id, function(err, trail) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {trail: trail});
            console.log(trail);
        }
    });
    
});

//CREATE COMMENT
router.post("/", isLoggedIn, function(req, res) {
    Trail.findById(req.params.id, function(err, trail) {
        if (err) {
            console.log(err);
            res.redirect("/trails");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log("=====================");
                    console.log(comment);
                    trail.comments.push(comment._id);
                    trail.save();
                    res.redirect("/trails/" + trail._id);
                }
            });
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