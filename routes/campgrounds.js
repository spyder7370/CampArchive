//REQUIRING NPM MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

//REQUIRING MODELS
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");

const {
	campgroundCreate,
	campgroundUpdate
} = require("../controllers/campgrounds")
const { asyncErrorHandler } = require("../middleware/error.js");
    
//CAMPGROUND INDEX ROUTE
router.get("/campgrounds", function(req, res){
	var noMatch = null;
	//if query string exists
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allCampgrounds){
			if(err){
				req.flash("error", "Something went wrong in campgrounds database");
				console.log(err);
				res.redirect("/")
			}
			else{
				if(allCampgrounds.length < 1) {
					noMatch = "No campgrounds match that query, please try again.";
				}
				res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
			}
		});
	}
	else{
		//get all campgrounds from mongodb
		Campground.find({}, function(err, allCampgrounds){
			if(err){
				req.flash("error", "Something went wrong in campgrounds database");
				console.log(err);
				res.redirect("/")
			}
			else{
				res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
			}
		});
	}
}); 


//CAMPGROUND NEW FORM ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})


//CAMPGROUND CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, asyncErrorHandler(campgroundCreate));
// router.post("/campgrounds", middleware.isLoggedIn, function(req,res){
// 	var name = req.body.name;
// 	var price = req.body.price;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var location = req.body.location;
// 	var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
// 	let response = await geocodingClient
// 		.forwardGeocode({
// 		query: req.body.location,
// 		limit: 1
// 		})
// 		.send();
// 	console.log(response);
// 	var newCampground = {name: name, price: price, image: image, location: location, coordinates: coordinates, description: desc, author: author};
// 	//create a new campground and save it to db
// 	Campground.create(newCampground, function(err, newlyCreated){
// 		if(err){
// 			req.flash("error", "Something went wrong in campgrounds database");
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		}
// 		else{
// 			req.flash("success", "Successfully added campground");
// 			res.redirect("/campgrounds");
// 		}
// 	});
// 	// eval(require("locus"));
// 	// console.log(response);	
// });


//CAMPGROUND SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
	//find campground with id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found");
			console.log(err);
			res.redirect("back");
		}else{
			//console.log(foundCampground);
			//render show page for that id 
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//CAMPGROUND EDIT FORM ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
			req.flash("error", "Campground not found");
            console.log(err);
			res.redirect("back");
        }
        else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});


//CAMPGROUND UPDATE ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, asyncErrorHandler(campgroundUpdate));
    //LOGIC
    //FIND AND UPDATE CAMPGROUND
//     //REDIRECT SOMEWHERE
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
//         if(err){
// 			req.flash("error", "Campground not found");
//             console.log(err);
// 			res.redirect("/campgrounds")
//         }
//         else{
// 			req.flash("success", "Successfully updated campground");
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// });


//CAMPGROUND DESTROY ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, middleware.deleteCampgroundComments, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
			req.flash("error", "Campground not found");
            console.log(err);
			res.redirect("/campgrounds");
        }
        else{
			req.flash("success", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


function geocode(location){
	try{
		return geocodingClient
		.forwardGeocode({
			query: location,
			limit: 1,
		})
		.send()
		.then((response) => {
			const match = response.body;
			const coordinates = match.features[0].geometry.coordinates;
			return coordinates;
		});
	}
	catch(err){
		console.log(err);
	}
	
}



module.exports = router;