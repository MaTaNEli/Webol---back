"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passResetMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function passResetMail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const newSecret = process.env.TOKEN_SECRET + user.password;
        const userInfo = {
            email: user.email,
            id: user.id
        };
        const token = jsonwebtoken_1.default.sign(userInfo, newSecret, { expiresIn: '10m' });
        const transporter = nodemailer_1.default.createTransport({
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
        return yield transporter.sendMail(mailOptions);
    });
}
exports.passResetMail = passResetMail;
;
