import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { UserInput } from '../types';


export async function passResetMail(user: UserInput & { id: string }) {
    const newSecret = process.env.TOKEN_SECRET + user.password;
    const userInfo = {
        email: user.email,
        id: user.id
    };
    const token = jwt.sign(userInfo, newSecret, { expiresIn: '10m'});
        
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.WEBSITE_EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });
          
    const mailOptions = {
        from: process.env.WEBSITE_EMAIL,
        to: user.email,
        subject: 'Reset your password',
        html: `<h1> Webol</h1>
            <h2>Reset your password</h2>
    
            <h4> Hi ${user.fullName} </h4>
    
            <h4>Let's reset your password so you can get back to learn some more amazing things</h4>
    
            <p>kindly use this
            <a href="http://localhost:3000/resetpass/${user.id}/${token}"> link</a> to verify your email address</p>
    
            <p>always here to help, Webol</p>`
    };
          
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error, 'Email did not sent: ');
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
}
