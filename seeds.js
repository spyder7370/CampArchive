var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data= [
	{
		name: "cloud's rest",
		image: "http://res.cloudinary.com/simpleview/image/upload/v1547763531/clients/texas/LODGING_2400x1600_ColoradoBend_d1a1c8d4-a21b-44c7-86e0-3c83599ba631.jpg",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quisquam iusto fugit. Voluptate, recusandae delectus laudantium suscipit illum excepturi totam ad incidunt voluptatem optio accusantium, modi animi corrupti accusamus ratione!"
	},
	{
		name: "desert mesa",
		image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2020%2F06%2F18%2Fgrand-canyon-national-park-mather-campground-NPCAMP0620.jpg",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quisquam iusto fugit. Voluptate, recusandae delectus laudantium suscipit illum excepturi totam ad incidunt voluptatem optio accusantium, modi animi corrupti accusamus ratione!"
	},
		{
		name: "canyon floor",
		image: "https://www.nps.gov/shen/planyourvisit/images/20171025_MACG_A-Loop_SNP1199_nl.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
		description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur quisquam iusto fugit. Voluptate, recusandae delectus laudantium suscipit illum excepturi totam ad incidunt voluptatem optio accusantium, modi animi corrupti accusamus ratione!"
	}
]

function seedDB(){
	//remove everything
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("removed everything");
			//add a few campgrounds to the database
			data.forEach(function(seed){
				Campground.create(seed, function(err,campground){
					if(err){
						console.log(err);
					}else{
						console.log("added");
						//add a comment
						Comment.create(
							{
								text: "no internet",
								author: "homer"
							},function(err,comment){
								if(err){
									console.log(err);
								}else{
									campground.comments.push(comment);
									campground.save();
									console.log("added a new comment");
								}	
							});
					}
				});
			});
		}
	});
}


module.exports = seedDB;