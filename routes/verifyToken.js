const jwt = require ('jsonwebtoken');

exports.token = async  (req, res, next) => {
    const token = await req.header('auth-token');
    if (!token) return res.status(401).json('Access Denide');

    console.log(token);
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("verify")
        req.user = verified;
        next();
    }catch(err){
        console.log("not verify");
        res.status(400).json('Invalid Token')
    }
}