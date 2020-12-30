const {User}= require('../model/user/user');

module.exports= async function(req, res, next){


    const user = await User.findOne({_id: req.currentUser._id})
    
        if(!user) return res.status(400).send({
            error:true,
            message:'Not a valid user'
        })
        
        if(user.admin){
            next()
        }else{
            return res.status(403).send({
                error:true,
                message:'Restricted Area'
            })
        }

        
}