var Trail = require("../models/trail");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkTrailOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Trail.findById(req.params.id, function(err, foundTrail) {
            if (err) {
                req.flash("error", "Trail not found");
                res.redirect("back");
            } else {
                if (!foundTrail) {
                    req.flash("error", "Trail not found.");
                    return res.redirect("back");
                }
                //Does the user own the trail?
                if (foundTrail.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have premission to do that");
                    res.redirect("back");
                }
                
            }
        });
    } else {
       req.flash("error", "You need to be logged in to do that");
       res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //Does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have premission to do that");
                    res.redirect("back");
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
       res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};


module.exports = middlewareObj;