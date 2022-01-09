const jwt = require ('jsonwebtoken');
const pool = require('../config/database');


exports.token =  (req, res, next) => {
    const token = req.header('auth_token');
    if (!token) return res.status(401).json({error: 'Access Denide'});

    try{
        req.user = jwt.verify(token, process.env.TOKEN_SECRET);
        next();

    } catch (err) {
        res.status(401).json({error: 'Access Denide'});
    }
}

exports.resetPassToken = async (req, res, next) => {
    const token = req.header('mail_token');
    if (!token){
        return res.status(401).json({error: "Access Denied"});
    } 
    let user;

    try{
        user = await pool.query(`SELECT * FROM users WHERE id='${req.body.id}'`);
    } catch(err) {
        console.log("verify token line 28", err);
    }

    if (user.rows[0]){
        const newSecret = process.env.TOKEN_SECRET + user.rows[0].password;
        try{
            const userInfo = jwt.verify(token, newSecret);
            if(userInfo){
                req.user = userInfo;
                next();
            }
            else{
                return res.status(401).json({error: 'This link was expired'});
            }
        }
        catch {
            return res.status(401).json({error: 'This link was expired'});
        } 
    } else {
        console.log("verify token line 46");
        res.status(200).json({error: 'Could not find the user'});
    };
};