import Joi from '@hapi/joi';
import { UserInput } from '../types';

export function registerValidation(data: UserInput) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(8),
        email:Joi.string()
            .required()
            .email(),
        fullName:Joi.string()
            .required(),
        username:Joi.string()
            .required()
    });
    return schema.validate(data);
};

export function loginValidation(data: Pick<UserInput, 'username'|'password'>) {
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
};

export function passwordValidation(data: { password: string }) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
};

export function emailValidation(data: { email: string }) {
    const schema = Joi.object({
        email:Joi.string()
            .required()
            .email()
    });
    return schema.validate(data);
};
