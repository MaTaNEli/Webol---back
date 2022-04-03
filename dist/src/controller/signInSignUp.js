"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.passUpdate = exports.passwordReset = exports.googleLogIn = exports.logInPost = exports.registerPosts = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate = __importStar(require("../validate/registerValidate"));
const passEmailVer = __importStar(require("../mailer/passverification"));
const user_1 = __importDefault(require("../entity/user"));
const genUsername = require("unique-username-generator");
function registerPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the data
        const { error } = validate.registerValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            // Check if user is in DB
            const result = yield user_1.default.find({
                where: [
                    { email: req.body.email },
                    { username: req.body.username }
                ],
                select: ['username', 'email']
            });
            if (result[0]) {
                if (result[0].email == req.body.email)
                    return res.status(400).json({ error: "Email is already exist" });
                else
                    return res.status(400).json({ error: "Username is already exist" });
            }
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        // Hash the password
        const salt = yield bcryptjs_1.default.genSalt(12);
        const hashpass = yield bcryptjs_1.default.hash(req.body.password, salt);
        // Create user for DB
        const { fullName, email, username } = req.body;
        const user = createUser(fullName, email, username);
        user.password = hashpass;
        // Save the user in DB
        try {
            yield user.save();
            res.status(200).json({ message: "Sign up successfully" });
        }
        catch (err) {
            const result = yield user_1.default.find({
                where: [
                    { email: req.body.email }
                ]
            });
            console.log(req.body);
            console.log(result);
            res.status(500).json({ error: err.message });
        }
    });
}
exports.registerPosts = registerPosts;
;
function logInPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the data
        const { error } = validate.loginValidation(req.body);
        if (error) {
            return res.status(400).json({ error: "Email or Password are incorrect" });
        }
        let result;
        try {
            // Check if user is in DB
            result = yield user_1.default.findOne({
                where: [
                    { email: req.body.username },
                    { username: req.body.username }
                ],
                select: ['id', 'password', 'username']
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result && (yield bcryptjs_1.default.compare(req.body.password, result.password))) {
            const token = createToken(result.id, result.username);
            const UserInfo = {
                username: result.username,
                auth_token: token
            };
            res.status(200).json({ UserInfo });
        }
        else {
            res.status(401).json({ error: "Email or Password are incorrect" });
        }
    });
}
exports.logInPost = logInPost;
;
function googleLogIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        // Create a user
        try {
            user = yield user_1.default.findOne({
                where: [
                    { email: req.body.email }
                ],
                select: ['id', 'username']
            });
            if (!user) {
                // Generate username
                const username = yield userNameGenerator(req.body.email);
                // Save user in DB
                const { name, email } = req.body;
                const user = createUser(name, email, username);
                yield user.save();
            }
            ;
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        ;
        if (!user) {
            try {
                user = yield user_1.default.findOne({
                    where: [
                        { email: req.body.email }
                    ],
                    select: ['id', 'username']
                });
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }
        ;
        if (user) {
            const token = createToken(user.id, user.username);
            const UserInfo = {
                username: user.username,
                auth_token: token
            };
            res.status(200).json({ UserInfo });
        }
        else {
            res.status(404).send();
        }
    });
}
exports.googleLogIn = googleLogIn;
;
function passwordReset(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate the data
        const { error } = validate.emailValidation(req.body);
        if (error) {
            return res.status(400).json({ error: "Email is not valid" });
        }
        let user;
        try {
            user = yield user_1.default.findOne({
                where: [
                    { email: req.body.email }
                ],
                select: ['id', 'fullName', 'email', 'password']
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        try {
            yield passEmailVer.passResetMail(user);
            res.status(200).json({ message: "Email send" });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ error: "User did not found" });
        }
    });
}
exports.passwordReset = passwordReset;
;
function passUpdate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pass = {
            password: req.body.password
        };
        // Validate the data
        const { error } = validate.passwordValidation(pass);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        if (req.body.password == req.body.passwordConfirm) {
            // Hash the password
            const salt = yield bcryptjs_1.default.genSalt(12);
            const hashpass = yield bcryptjs_1.default.hash(req.body.password, salt);
            try {
                yield user_1.default.update({ id: req.body.id }, { password: hashpass });
                res.status(200).json({ message: "The password updated successfully" });
            }
            catch (err) {
                return res.status(500).json({ error: err.message });
            }
        }
        else {
            res.status(400).json({ error: "The password must be equal" });
        }
    });
}
exports.passUpdate = passUpdate;
;
function userNameGenerator(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let username;
        let tempUser;
        do {
            username = genUsername.generateFromEmail(email, 3);
            tempUser = yield user_1.default.findOne({
                where: [
                    { username: username }
                ],
                select: ['username']
            });
        } while (tempUser);
        return username;
    });
}
;
function createUser(fullName, email, username) {
    const user = new user_1.default();
    user.fullName = fullName;
    user.email = email;
    user.username = username;
    user.profileImage = process.env.PROFILE_IMAGE;
    user.themeImage = process.env.THEME_IMAGE;
    user.media = 0;
    return user;
}
;
function createToken(id, username) {
    const tokenUser = {
        id: id,
        username: username
    };
    return (jsonwebtoken_1.default.sign(tokenUser, process.env.TOKEN_SECRET));
}
;
