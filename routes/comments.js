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

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {trail_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id",checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/trails/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/trails/" + req.params.id);
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

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //Does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
       res.redirect("back");
    }
}


module.exports = router;