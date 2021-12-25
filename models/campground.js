var mongoose= require("mongoose");


var campgroundSchema = new mongoose.Schema({

	name: String, 

	price: String,

	image: String,

	description: String,

	info2: {
		type: String, 
		default: "No info 2 given"
	},

	info3: {
		type: String, 
		default: "No info 3 given"
	},

	location: String,

	coordinates: Array,

	createdAt: { 
		type: Date, 
		default: Date.now 
	},

	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		
		username: String
	},

	comments: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Comment"
		}
	]

});


module.exports = mongoose.model("Campground", campgroundSchema);