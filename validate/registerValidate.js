const Joi = require('@hapi/joi');

// Register validation

exports.registerValidation = data => {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(8),
        email:Joi.string()
            .required()
            .email(),
        full_name:Joi.string()
            .required(),
        username:Joi.string()
            .required()
    });
    return schema.validate(data);
};

exports.loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
};

exports.passwordValidation = data => {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(8)
    });
    return schema.validate(data);
};


exports.emailValidation = data => {
    const schema = Joi.object({
        email:Joi.string()
            .required()
            .email()
    });
    return schema.validate(data);
};
