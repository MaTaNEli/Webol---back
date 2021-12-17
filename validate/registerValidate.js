const Joi = require('@hapi/joi');

// Register validation

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
            .min(6),
        email:Joi.string()
            .required()
            .email(),
        full_name:Joi.string()
            .required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .required()
            .min(6)
    });
    return schema.validate(data);
};


module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;