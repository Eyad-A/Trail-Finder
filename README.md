# Trail Finder
A site where you can view and post hiking trails from all over the US, and comment on your favorite ones. Using Javascript, Node, Express, and mongoDB.

## Version 0.1.0:
 - Early layout added
 - Place holder trails with images added
 - Added form for adding new trails
 - Added routes for landing page, trails page, and new trails page

## Version 0.2.0:
 - Added mongoDB and mongoose
 - Data now presists
 - Renamed trails.ejs to index.ejs
 - Updated the form used to add new trails to also include 'description' in addition to 'name' and 'image'
 - Added the show route

## Version 0.3.0:
 - Refactored app.js
 - Added the model directory and the comments model
 - Added module.exports
 - Added the seeds.js file
 - Comments now display correctly on the show page

## Version 0.3.1:
 - Added the 'new' and 'create' routes for comments
 - Added form for adding new comments
 - Split templates into two different directories: 'camps' and 'comments'
 - Updated links to the partials

## Version 0.3.2:
 - Added main.css for custom styling
 - Added sidebar to the show page
 - Added more styling to comments

## Version 0.4.0:
 - Added passport, passport-local, passport-local-mongoose, and express-session
 - Added the User model
 - Added the register, login, and logout routes and templates
 - Added logic to display the right links in the navbar

## Version 0.4.1
 - Refactored app.js
 - Added routes directory and created a new file for each of: trails, comments, and index

## Version 0.5.0
 - Added users and comments association
 - Added author to the comment model
 - Comments author's name is now saved automatically

## Version 0.5.1
 - Added users and trails association
 - Username now saves when creating a new trail
 - Only logged in users can now create new trails

## Version 0.6.0
 - Added edit and destroy routes for trails
 - Added method-override

## Version 0.6.1
 - Added authorization for trails
 - Users can now only edit/delete their own trails
 - Added logic to only show edit/delete buttons if the trail's owner is logged in

## Version 0.6.2
 - Added edit, update, and delete routes for comments
 - Added edit and delete buttons for comments
 - Added user authorization for comments
 - Added logic to only show edit/delete buttons for comment's owner
