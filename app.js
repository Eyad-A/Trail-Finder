var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Trail       = require("./models/trail"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
//REQUIRED ROUTES
var commentRoutes = require("./routes/comments"),
    trailRoutes = require("./routes/trails"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/trail_finder");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
app.locals.moment = require("moment");

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Get to the next screen",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// var trails = [
//             {name: "Spring Creek", image: "https://farm6.staticflickr.com/5240/5901787178_5eef7e4134.jpg"},
//             {name: "Mountain Top", image: "https://farm1.staticflickr.com/453/19094215060_de6549b159.jpg"},
//             {name: "West Maroon Creek Trail", image: "https://farm1.staticflickr.com/13/16808090_ea4f4e4e1c.jpg"},
//             {name: "Precipice Trail", image: "https://farm1.staticflickr.com/45/117404266_1d8290ea78.jpg"},
//             {name: "Angel’s Landing", image: "https://farm1.staticflickr.com/267/19917703508_d580a41ee5.jpg"},
//             {name: "Mooney Falls", image: "https://farm5.staticflickr.com/4018/4304042814_5042d9fa91.jpg"},
//             {name: "Red River Gorge", image: "https://farm5.staticflickr.com/4039/4300128555_8b09b028ea.jpg"},
//             {name: "The Highline Trail", image: "https://farm6.staticflickr.com/5455/9402224338_7ced8f43eb.jpg"}
//         ];


app.use("/", indexRoutes);
app.use("/trails", trailRoutes);
app.use("/trails/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("TrailFinder has started!");
});