const Joi = require('@hapi/joi');

// Register validation

exports.registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
            .min(6),
        email:Joi.string()
            .required()
            .email(),
        fullname:Joi.string()
            .required()
    });
    return schema.validate(data);
};

exports.loginValidation = data => {
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

exports.passwordValidation = data => {
    const schema = Joi.object({
        password: Joi.string()
            .required()
            .min(6)
    });
    return schema.validate(data);
};

exports.googleValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        email:Joi.string()
            .required()
            .email(),
        fullname:Joi.string()
            .required()
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
