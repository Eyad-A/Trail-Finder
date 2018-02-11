var mongoose = require("mongoose");
var Trail = require("./models/trail");
var Comment = require("./models/comment");

var data = [
        {name: "Cloud's rest", 
        image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Mohonk_Mountain_House_2011_Hiking_Trail_against_Guest_Rooms_2_FRD_3281.jpg",
        description: "Twee poutine pok pok tumeric, distillery before they sold out post-ironic helvetica hexagon farm-to-table letterpress etsy cronut. Hot chicken artisan gentrify, small batch portland cred cold-pressed raclette keytar ennui health goth austin VHS hexagon. YOLO austin before they sold out kinfolk organic tousled letterpress jianbing adaptogen kale chips. Pickled vinyl banh mi ennui waistcoat literally keytar 90's wolf chicharrones scenester knausgaard distillery forage flannel. Cray listicle umami, succulents poutine retro salvia. Kitsch shaman coloring book vegan venmo sartorial listicle. YOLO seitan sartorial pok pok fixie cray, edison bulb thundercats kale chips godard bushwick."},
        {name: "Mountain Top", 
        image: "https://cdn.pixabay.com/photo/2017/07/26/01/43/hiking-2540189_960_720.jpg",
        description: "Artisan hammock post-ironic, biodiesel enamel pin cardigan vinyl green juice kale chips pitchfork polaroid. Gentrify fam la croix shoreditch. Roof party crucifix fingerstache fixie trust fund. Hexagon disrupt slow-carb kitsch gochujang franzen. Asymmetrical tbh dreamcatcher hot chicken small batch lomo vaporware, farm-to-table cray humblebrag chia ramps beard master cleanse."},
        {name: "Angels Landing", 
        image: "https://www.nps.gov/havo/planyourvisit/images/Halemaumau_trail_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "Lorem ipsum dolor amet semiotics drinking vinegar post-ironic, sustainable pabst hoodie letterpress. Trust fund heirloom four loko, small batch swag 8-bit artisan kombucha sriracha wayfarers art party cloud bread copper mug flannel. Bespoke cardigan blue bottle banh mi. Listicle hexagon schlitz, salvia tofu selvage quinoa activated charcoal four loko. Put a bird on it pour-over direct trade, truffaut deep v hoodie master cleanse sriracha try-hard. Meggings selfies ugh try-hard cold-pressed church-key coloring book farm-to-table, letterpress pok pok 90's."}
    ];

function seedDB(){
   //Remove all trails
   Trail.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed trails!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few trails
            data.forEach(function(seed){
                Trail.create(seed, function(err, trail){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a trail");
                        //create a comment
                        Comment.create(
                            {
                                text: "Great hike, great view",
                                author: "Bob"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    trail.comments.push(comment._id);
                                    trail.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;