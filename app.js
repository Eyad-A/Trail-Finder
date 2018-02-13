var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Trail       = require("./models/trail"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost/trail_finder");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();

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

app.get("/", function(req, res) {
    res.render("landing");
});

//INDEX
app.get("/trails", function(req, res) {
    //Get all trails from DB
    Trail.find({}, function(err, allTrails) {
        if (err) {
            console.log(err);
        } else {
             res.render("trails/index", {trails: allTrails});
        }
    });
});

//CREATE
app.post("/trails", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newTrail = {name: name, image: image, description: desc};
    //Create a new trail and save to DB
    Trail.create(newTrail, function(err, newlyCreate) {
        if (err) {
            console.log(err);
        } else {
            //Redirect back to trails page
            res.redirect("/trails");
        }
    });
});

//NEW
app.get("/trails/new", function(req, res) {
    res.render("trails/new");
});

//SHOW
app.get("/trails/:id", function(req, res) {
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundTrail);
            res.render("trails/show", {trail: foundTrail});
        }
    });
});

// ================
// Comments Routes
//=================

app.get("/trails/:id/comments/new", isLoggedIn, function(req, res) {
    Trail.findById(req.params.id, function(err, trail) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {trail: trail});
            console.log(trail);
        }
    });
    
});

app.post("/trails/:id/comments", isLoggedIn, function(req, res) {
    Trail.findById(req.params.id, function(err, trail) {
        if (err) {
            console.log(err);
            res.redirect("/trails");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    trail.comments.push(comment._id);
                    trail.save();
                    res.redirect("/trails/" + trail._id);
                }
            });
        }
    });
});

//AUTH ROUTES

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/trails");
        });
    });
});

//Login
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/trails",
        failureRedirect: "/login"
    }), function(req, res) {
});

//LOGOUT ROUTES
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/trails");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("TrailFinder has started!");
});