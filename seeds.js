var mongoose = require("mongoose");
var Trail = require("./models/trail");
var Comment = require("./models/comment");

var data = [
        {name: "Cloud's rest", 
        image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Mohonk_Mountain_House_2011_Hiking_Trail_against_Guest_Rooms_2_FRD_3281.jpg",
        description: "A very short and sweet hiking trail"},
        {name: "Mountain Top", 
        image: "https://cdn.pixabay.com/photo/2017/07/26/01/43/hiking-2540189_960_720.jpg",
        description: "A very long hiking trail"},
        {name: "Angels Landing", 
        image: "https://www.nps.gov/havo/planyourvisit/images/Halemaumau_trail_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "A hiking trail with great views!"}
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