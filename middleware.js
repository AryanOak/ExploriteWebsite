module.exports = isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You Must Be Loggedin To Create Listing!");
        return res.redirect("/login");
      }
      next();
}