const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})
const isLoggedIn = require("../middleware.js");



const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  
  //New Route
  router.get("/new", isLoggedIn ,(req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing does not exists ");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }));
  
  //Create Route
  router.post("/",upload.single('listing[image]'),isLoggedIn ,validateListing,wrapAsync(async (req, res,next) => {
    let url = req.file.path;
    let filename = req.file.filename
    const newListing = new Listing(req.body.listing);
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
    
  }));
  
  //Edit Route
  router.get("/:id/edit", isLoggedIn ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing does not exists ");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  router.put("/:id", upload.single("listing[image]"),validateListing ,isLoggedIn ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("Success","Listing Updated");
    res.redirect(`/listings/${id}`);
  }));
  
  
  //Delete Route
  router.delete("/:id",isLoggedIn ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }));
  
  module.exports = router;