//REQUIRING NPM MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");

//REQUIRING MODELS
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");



//COMMENT NEW FORM ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			res.render("comments/new", {campground: campground});
		}
	});
});


//COMMENT CREATE ROUTE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
	//LOGIC
	//lookup campground by id
	//create a comment
	//connect comment to campground
	//redirect to campground show page
	req.body.comment.text = req.sanitize(req.body.comment.text);
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error", "Something went wrong in the comments database");
					console.log(err);
					res.redirect("/campgrounds/" + req.params.id);
				}
				else{
                    //add username and id to comment and save the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //push the comment into the campground
					campground.comments.push(comment);
					campground.save();

					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + req.params.id);
				}
			});
		}
	});
});


//COMMENT EDIT FORM ROUTE
router.get("/campgrounds/:id/comments/:commentId/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.commentId, function(err,comment){
		if(err){
			req.flash("error", "Comment not found");
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {comment:comment, campgroundId: req.params.id});
		}
	});
});


//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:commentId", middleware.checkCommentOwnership, function(req,res){
	req.body.comment.text = req.sanitize(req.body.comment.text);
	Comment.findByIdAndUpdate(req.params.commentId,req.body.comment, function(err,updatedComment){
		if(err){
			req.flash("error", "Comment not found");
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Successfully updated comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:commentId",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.commentId, function(err){
		if(err){
			req.flash("error", "Comment not found");
			console.log(err);
			res.redirect("/campgrounds/" + req.params.id);
		} else {
			req.flash("success", "Successfully deleted comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;