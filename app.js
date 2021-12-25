//REQUIRING NPM MODULES
var bodyParser    	 = require("body-parser"),
	express          = require("express"),
	expressSanitizer = require("express-sanitizer"),
	flash		     = require("connect-flash"),
	localStrategy    = require("passport-local"),
	methodOverride   = require("method-override"),
	mongoose         = require("mongoose"),
	passport         = require("passport");
var app = express();
require("dotenv").config();

//MONGOOSE CONNECTION
//OLD CONNECTION: mongoose.connect("mongodb://localhost/yelp_camp");
//NEW CONNECTION
const uri = process.env.MONGODB_URI;
// mongoose
// .connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true })
// .then(() => console.log("DB working!"))
// .catch((error) => console.log(error));;
mongoose
.connect(uri, { useNewUrlParser: true })
.then(() => console.log("DB working!"))
.catch((error) => console.log(error));;

//MOMENT JS FOR TIME APPLICATIONS
app.locals.moment = require("moment");

//MAPBOX CONFIGURATION
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

//SEEDING THE DATABASE
// var seedDB = require("./seeds");
// seedDB();


//REQUIRING MODELS
var Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User       = require("./models/user");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "this can be anything",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//LOCAL CONFIGURATION
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})


//REQUIRING ROUTES
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");
//USING ROUTES
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

//PORT CONNECTION
const port=process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server started");
});