import Joi from '@hapi/joi';

export function userNameValidation(data : {username: string}) {
    const schema = Joi.object({
        username: Joi.string().required()
    });
    return schema.validate(data);  
};