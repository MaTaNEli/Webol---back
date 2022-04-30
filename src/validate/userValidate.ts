import Joi from '@hapi/joi';

export function userNameValidation(data : {username: string}) {
    const schema = Joi.object({
        username: Joi.string().required()
    });
    return schema.validate(data);  
};

export function fullNameValidation(data : {fullName: string}) {
    const schema = Joi.object({
        fullName: Joi.string().required()
    });
    return schema.validate(data);  
};

export function newPasswordValidation(data : {oldPassword: string, newPass: string, confirm: string}) {
    const schema = Joi.object({
        oldPassword: Joi.string()
            .required()
            .min(8),
        newPass: Joi.string()
            .required()
            .min(8),
        confirm: Joi.string()
            .required()
            .min(8)
            .valid(Joi.ref('newPass'))
    });
    return schema.validate(data);  
};