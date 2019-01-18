// All our middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
   if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
         if(err){
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
         } else {
            if(foundCampground.author.id.equals(req.user._id)){
                next();  
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
         }
      });
   } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
   }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
   if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
         if(err){
            res.redirect("/campgrounds");
         } else {
            // Does owner own the comment?
            if(foundComment.author.id.equals(req.user._id)){
               next();  
            } else {
                req.flash("error", "You don't have permission to do that");
               res.redirect("back");
            }
         }
      });
   } else {
       req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
   }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
     return next();
  }
  //Flash won't display until the next thing that we see. Add it before you redirect
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObj;