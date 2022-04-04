import Joi from '@hapi/joi';
import { PostInput, CommentInput } from '../types';


export function addPostValidation(data : PostInput) {
    const schema = Joi.object({
        description: Joi.string().required(),
        url: Joi.string()
    });
    return schema.validate(data);  
};

export function addCommentValidation(data : CommentInput) {
    const schema = Joi.object({
        content: Joi.string().required(),
        postId: Joi.string().required()
    });
    return schema.validate(data);  
};