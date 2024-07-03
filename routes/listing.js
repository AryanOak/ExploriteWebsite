const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const path = require("path");

const listingController = require("../controllers/listing.js");



router.get("/", wrapAsync(listingController.index));
  
  //New Route
  router.get("/new", isLoggedIn ,listingController.renderNewForm);
  
  //Show Route
  router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
  router.post("/",upload.single('listing[image]'),isLoggedIn,validateListing,wrapAsync(listingController.createListing));
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.renderEditForm));
  
  //Update Route
  router.put("/:id", upload.single("listing[image]"),isLoggedIn, validateListing ,wrapAsync(listingController.updateListing));
  
  
  //Delete Route
  router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroyListing));
  
  module.exports = router;