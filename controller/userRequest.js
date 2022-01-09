//const { user } = require('pg/lib/defaults');
const pool = require('../config/database'); 

exports.getUserImage = async (req, res) =>{
    let user;
    try{
        user = await pool.query(`SELECT ${req.params.image} FROM users WHERE id='${req.user.id}'`);
    } catch(err) {
        console.log("controller/user request line 7", err);
    }

    if (user.rows[0]){
        res.status(200).json(user.rows[0]);
    } else {
        res.status(400).json({error:"User did not found"});
    }
};

exports.postUserImage = async (req, res) =>{
    console.log(req.params)
    try{
        await pool.query(`UPDATE users SET ${req.params.image} = '${req.body.imgurl}' WHERE id = '${req.user.id}'`);
        res.status(200).json({message: "Profile image updated successfully"});
    } catch(err) {
        console.log("controller/user request line 39", err);
        res.status(400).json({error: "Profile image did not updated"});
    }
};
