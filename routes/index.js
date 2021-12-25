//REQUIRING NPM MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var middleware = require("../middleware");

//REQUIRING MODELS
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");



//APP LANDING ROUTE
router.get("/", function(req, res){
	res.render("landing");
});


//============
//AUTH ROUTES
//============


//REGISTER FORM ROUTE
router.get("/register", function(req, res){
	res.render("register");
});


//SIGN UP LOGIC ROUTE
router.post("/register", function(req,res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to Camp Archive " + user.username + " !!");
			res.redirect("/campgrounds");
		});
	});
});


//LOGIN FORM ROUTE
router.get("/login", function(req,res){
	res.render("login");
});


//LOGIN LOGIC ROUTE
router.post("/login",passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
        successFlash: 'Welcome to Camp Archive!'
	}), function(req,res){
});


//LOGOUT ROUTE
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "See you later!!");
	res.redirect("/campgrounds");
});


//USER PROFILE SHOW ROUTE
router.get("/users/:id", function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "User not found in the database");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
				if(err){
					req.flash("error", "User does not has any campgrounds");
					console.log(err);
					res.redirect("back");
				} else {
					res.render("users/show", {user: foundUser, campgrounds: campgrounds});
				}
			});
		}
	});
});

//USER PROFILE EDIT PAGE ROUTE
router.get("/users/:id/edit", middleware.checkUserOwnership, function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "User not found in the database");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("users/edit", { user: foundUser });
		}
	})
});

//USER PROFILE UPDATE ROUTE
router.put("/users/:id", middleware.checkUserOwnership, function(req,res){
	req.body.user.about = req.sanitize(req.body.user.about);
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash("error", "User not found in the database");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Successfully updated profile of " + updatedUser.username);
			res.redirect("/users/" + req.params.id);
		}
	});
})



module.exports = router;