import Joi from '@hapi/joi';

export function userNameValidation(data : {username: string}) {
    const schema = Joi.object({
        username: Joi.string().required()
    });
    return schema.validate(data);  
};

export function fullNameValidation(data : {fullName: string}) {
    const schema = Joi.object({
        fullName: Joi.string().required().max(30)
    });
    return schema.validate(data);  
};

export function addBioValidation(data : {bio:string}) {
    const schema = Joi.object({
        bio: Joi.string().max(150)
    });
    return schema.validate(data);  
};

export function newPasswordValidation(data : {password: string, newPassword: string, passwordConfirmation: string}) {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(8),
        newPassword: Joi.string()
            .required()
            .min(8),
        passwordConfirmation: Joi.string()
            .required()
            .min(8)
    });
    return schema.validate(data);  
};