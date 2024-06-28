module.exports=isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must Be Loggedin To Create Listing!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
    let Listing = await Listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you dont have permission");
      return res.redirect(`/listings/${id}`);
    }
}