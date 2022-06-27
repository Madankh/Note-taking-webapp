const jwt = require('jsonwebtoken');

const fetchuser=(req , res, next)=>{
    const token = req.header("auth-token");
    if(!token){
        return res.status(401).json("Please authoticate with valid password")
    }
    try {
        const data = jwt.verify(token , process.env.JWT_SEC);
        req.user = data.user
        next();
        
    } catch (error) {
        res.status(500).json({error:"Please try again"})
    }
}

module.exports = fetchuser;