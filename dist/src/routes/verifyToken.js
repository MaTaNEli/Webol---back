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
exports.resetPassToken = exports.connect = exports.admin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../entity/user"));
function admin(req, res, next) {
    const token = req.header('auth_token');
    if (!token)
        return res.status(401).json({ error: 'Access Denide' });
    try {
        req['user'] = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        if (req['user'].username == req.params.username)
            next();
        else
            res.status(401).json({ error: 'Access Denide' });
    }
    catch (err) {
        res.status(401).json({ error: 'Access Denide' });
    }
}
exports.admin = admin;
function connect(req, res, next) {
    const token = req.header('auth_token');
    if (!token) {
        return res.status(401).json({ error: 'Access Denide' });
    }
    ;
    try {
        req['user'] = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        if (req['user'])
            next();
        else
            res.status(401).json({ error: 'Access Denide' });
    }
    catch (err) {
        res.status(401).json({ error: 'Access Denide' });
    }
}
exports.connect = connect;
function resetPassToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log;
        const token = req.header('mail_token');
        if (!token) {
            return res.status(401).json({ error: "Access Denied" });
        }
        let user;
        try {
            user = yield user_1.default.findOne(req.body.id);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log(user, "the user from verify line 54");
        if (user) {
            const newSecret = process.env.TOKEN_SECRET + user.password;
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, newSecret);
                if (userInfo) {
                    req['user'] = userInfo;
                    next();
                }
                else {
                    return res.status(401).json({ error: 'This link was expired' });
                }
            }
            catch (_a) {
                return res.status(401).json({ error: 'This link was expired' });
            }
        }
        else {
            res.status(200).json({ error: 'Could not find the user' });
        }
        ;
    });
}
exports.resetPassToken = resetPassToken;
;
