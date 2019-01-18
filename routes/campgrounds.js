//If we require a directory, it will automatically acquire the index file

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// Index
router.get("/", function(req, res){
   //Get all campgrounds from db
   Campground.find({}, function(err, allCampgrounds){
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
      }
   });
});

//Create
router.post("/", middleware.isLoggedIn, function(req, res){
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var price = req.body.price;
   var author = {
      id: req.user._id,
      username: req.user.username
   }
   var newCampground = {name: name, price:price, image: image, description: desc, author:author};
   //Create a new campground and save to database
   Campground.create(newCampground, function(err, newlyCreated){
      if(err){
         console.log(err);
      } else {
         //redirect back to campgrounds page
         res.redirect("/campgrounds");
      }
   });
});

// New 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
         console.log(err);
      } else {
         res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

// EDIT Route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   // Is user logged in? If they are, do they own campground?
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
         req.flash("error", "Campground not found");
      }
      res.render("campgrounds/edit", {campground: foundCampground});  
   });
});

// UPDATE Route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   //Find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
         res.redirect("/campgrounds");
      } else {
         //Redirect somewhere (show page)
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
   
});

// Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
         res.redirect("/campgrounds");
      } else {
         res.redirect("/campgrounds");
      }
   });
});


module.exports = router;