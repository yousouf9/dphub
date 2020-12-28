const {User}= require('../model/user/user');

module.exports= async function(req, res, next){
    let token = req.cookies['x-auth']

    if(!token) return res.status(403).send({
        error:true,
        message: "You don't have the right permission to accesss here"

    })

    let decoded = await User.findByToken(token);

    if(!decoded) return res.status(400).send("Invalid Token");


    const user = await User.findOne({_id: decoded.id, loginToken:token})
    
        if(!user) return res.status(400).send({
            error:true,
            message:'Invalid user token'
        })
        
        req.token = token;
        req.currentUser = user;

        next()
}