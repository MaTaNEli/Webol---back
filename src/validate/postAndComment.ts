import Joi from '@hapi/joi';
import { PostInput, CommentInput } from '../types';

export function addPostValidation(data : PostInput) {
    const schema = Joi.object({
        description: Joi.string().required(),
        url: Joi.string(),
        category: Joi.string().required()
    });
    return schema.validate(data);  
};

export function addCommentValidation(data : CommentInput) {
    const schema = Joi.object({
        content: Joi.string().required(),
        postId: Joi.number().required(),
        userId: Joi.string().required()
    });
    return schema.validate(data);  
};

