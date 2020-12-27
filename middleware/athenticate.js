module.exports=function(req, res, next){
    if( req.isAuthenticated()){
        console.log('Authenticated user', req.isAuthenticated())
         next();
    }else{
        res.redirect('/user/login');
        console.log('unAuthenticated user', req.isAuthenticated())
    }

    
}