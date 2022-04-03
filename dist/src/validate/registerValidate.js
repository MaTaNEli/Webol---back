"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValidation = exports.passwordValidation = exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
function registerValidation(data) {
    const schema = joi_1.default.object({
        password: joi_1.default.string()
            .required()
            .min(8),
        email: joi_1.default.string()
            .required()
            .email(),
        fullName: joi_1.default.string()
            .required(),
        username: joi_1.default.string()
            .required()
    });
    return schema.validate(data);
}
exports.registerValidation = registerValidation;
;
function loginValidation(data) {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .required(),
        password: joi_1.default.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
}
exports.loginValidation = loginValidation;
;
function passwordValidation(data) {
    const schema = joi_1.default.object({
        password: joi_1.default.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
}
exports.passwordValidation = passwordValidation;
;
function emailValidation(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .required()
            .email()
    });
    return schema.validate(data);
}
exports.emailValidation = emailValidation;
;
