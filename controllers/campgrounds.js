const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    User = require("../models/user");

module.exports={
    //campground create
    async campgroundCreate(req, res, next) {
        req.body.campground.description = req.sanitize(req.body.campground.description);
		req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
		let response = await geocodingClient
		  .forwardGeocode({
		    query: req.body.campground.location,
		    limit: 1
		  })
		  .send();
            
        req.body.campground.coordinates = response.body.features[0].geometry.coordinates;
		let campground = await Campground.create(req.body.campground);
        req.flash("success", "Successfully added campground");
		res.redirect(`/campgrounds/${campground.id}`);
	},

    //campground update
    async campgroundUpdate(req, res, next) {
        req.body.campground.description = req.sanitize(req.body.campground.description);
        req.body.campground.info2 = req.sanitize(req.body.campground.info2);
        req.body.campground.info3 = req.sanitize(req.body.campground.info3);
		// find the post by id
		let campground = await Campground.findById(req.params.id);

        if(req.body.campground.location !== campground.location){
            let response = await geocodingClient
                .forwardGeocode({
                    query: req.body.campground.location,
                    limit: 1
                })
                .send();
            campground.coordinates = response.body.features[0].geometry.coordinates;
            campground.location = req.body.campground.location;
        }

		// update the post with any new properties
		campground.name = req.body.campground.name;
		campground.description = req.body.campground.description;
		campground.price = req.body.campground.price;
        campground.image = req.body.campground.image;
		campground.location = req.body.campground.location;
        campground.info2 = req.body.campground.info2;
        campground.info3 = req.body.campground.info3;
		// save the updated post into the db
		campground.save();
		// redirect to show page
        req.flash("success", "Successfully updated campground");
		res.redirect(`/campgrounds/${campground.id}`);
	}
    
}