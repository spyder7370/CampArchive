var middlewareObj = {};

var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");

    
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                console.log(err);
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, function(err, foundComment){
			if(err || !foundComment){
                req.flash("error", "Comment not found");
				console.log(err);
                res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
			}
		});
	} else {
        req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
    req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}


middlewareObj.deleteCampgroundComments = function(req,res,next){
    Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
		} else {
			foundCampground.comments.forEach(function(comment){
				Comment.findByIdAndRemove(comment._id, function(err){
					if(err){
						req.flash("error", "Something went wrong in comments database");
                        console.log(err);
                        res.redirect("back");
					} 
				})
			});
            next();
		}
	});
}


middlewareObj.checkUserOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		User.findById(req.params.id, function(err, foundUser){
			if(err || !foundUser){
                req.flash("error", "User not found");
				console.log(err);
                res.redirect("back");
			} else {
				if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/users/" + req.params.id);
                }
			}
		});
	} else {
        req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}




module.exports = middlewareObj;