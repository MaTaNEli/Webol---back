export interface UserInput {
    password: string;
    email: string;
    fullName: string;
    username: string;
};

export interface PostInput {
    description: string;
    url: string;
};

export interface CommentInput {
    content: string;
    postId: string;
};