var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var trails = [
            {name: "Spring Creek", image: "https://farm6.staticflickr.com/5240/5901787178_5eef7e4134.jpg"},
            {name: "Mountain Top", image: "https://farm1.staticflickr.com/453/19094215060_de6549b159.jpg"},
            {name: "West Maroon Creek Trail", image: "https://farm1.staticflickr.com/13/16808090_ea4f4e4e1c.jpg"},
            {name: "Precipice Trail", image: "https://farm1.staticflickr.com/45/117404266_1d8290ea78.jpg"},
            {name: "Angel’s Landing", image: "https://farm1.staticflickr.com/267/19917703508_d580a41ee5.jpg"},
            {name: "Mooney Falls", image: "https://farm5.staticflickr.com/4018/4304042814_5042d9fa91.jpg"},
            {name: "Red River Gorge", image: "https://farm5.staticflickr.com/4039/4300128555_8b09b028ea.jpg"},
            {name: "The Highline Trail", image: "https://farm6.staticflickr.com/5455/9402224338_7ced8f43eb.jpg"}
        ];

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/trails", function(req, res) {
        res.render("trails", {trails: trails});
});

app.post("/trails", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newTrail = {name: name, image: image};
    trails.push(newTrail);
    res.redirect("/trails");
});

app.get("/trails/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("TrailFinder has started!");
})