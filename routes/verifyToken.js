const jwt = require ('jsonwebtoken');
const User = require('../config/database');


exports.token = async  (req, res, next) => {
    const token = await req.header('auth_token');
    if (!token) return res.status(401).json('Access Denide');

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("verify")
        req.user = verified;
        next();
    } catch (err) {
        console.log(err, "not verify");
        res.status(400).json('Invalid Token')
    }
}

exports.resetPassToken = async (req, res, next) => {
    const token = await req.header('mail_token');
    if (!token){
        return res.status(400).json({error: "Access Denied"});
    } 

    try{
        User.findById(req.body.id)
        .then((user) => {
            if (user){
                const newSecret = process.env.TOKEN_SECRET + user.password;
                try{
                    const userInfo = jwt.verify(token, newSecret);
                    if(userInfo){
                        req.user = userInfo;
                        next();
                    }
                    else{
                        return res.status(400).json({error: 'This link was expired'});
                    }
                }
                catch {
                    return res.status(400).json({error: 'This link was expired'});
                }  
            }
            else {
                console.log("verify token line 46");
                res.status(200).json({error: 'Could not find the user'});
            }
        })
        .catch ( (err) => {
            res.status(400).json({error: "could not find user"})
        })
    } catch {
        console.log(err, "not verify line 51");
        res.status(400).json('Invalid Token')
    }
};