"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPost = exports.addCommands = exports.getUserPage = exports.postUserImage = void 0;
const user_1 = __importDefault(require("../entity/user"));
const post_1 = __importDefault(require("../entity/post"));
const comment_1 = __importDefault(require("../entity/comment"));
const lodash_1 = __importDefault(require("lodash"));
const typeorm_1 = require("typeorm");
function postUserImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_1.default.update({ id: req['user'].id }, { [req.params.image]: req.body.imgurl });
            res.status(200).json({ message: "Image updated successfully" });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
exports.postUserImage = postUserImage;
;
const blacklistFields = ['password', 'id'];
function getUserPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const information = {};
        try {
            // const user = await User.findOne({
            //     where: [
            //         {id: req['user'].id}
            //     ], select: ['fullName', 'profileImage', 'themeImage', 'role', 'media', 'bio']
            // });
            // const data = await Post.find({relations:["comment"],
            //     where:[
            //         {user: req['user'].id}
            //     ], select: ['id', 'createdAt', 'description', 'url']
            // });
            // information['user'] = user;
            // information['post'] = data;
            let data;
            try {
                data = yield (0, typeorm_1.getManager)()
                    .createQueryBuilder(user_1.default, 'u')
                    .select('u', '*')
                    .addSelect('p', '*')
                    .addSelect('c', '*')
                    .leftJoin(post_1.default, 'p', 'u.id = p."userId"')
                    .leftJoin(comment_1.default, 'c', 'p.id = c."postId"')
                    .where(`u.id = '${req['user'].id}'`)
                    .execute();
            }
            catch (error) {
                console.error(error);
            }
            const groupedPosts = lodash_1.default.groupBy(data, 'p_id');
            const postsResult = Object.entries(groupedPosts).map(([postId, comments]) => (Object.assign(Object.assign({}, (0, lodash_1.default)(comments[0])
                .pickBy((value, key) => key.startsWith('p_'))
                .mapKeys((value, key) => key.slice(2))
                .value()), { comments: comments.map(c => (0, lodash_1.default)(c)
                    .pickBy((value, key) => key.startsWith('c_'))
                    .mapKeys((value, key) => key.slice(2))
                    .value())
                    .filter(c => c.id) })));
            console.log(postsResult);
            if (postsResult)
                res.status(201).json({
                    user: (0, lodash_1.default)(data[0])
                        .pickBy((v, k) => k.startsWith('u_'))
                        .mapKeys((v, k) => k.slice(2))
                        .pickBy((v, k) => !blacklistFields.includes(k))
                        .value(),
                    posts: postsResult
                });
            else
                res.status(404).json("could not find any user");
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
exports.getUserPage = getUserPage;
;
function addCommands(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        const command = new comment_1.default;
        command.createdAt = date;
        command.content = req.body.content;
        command.post = req.body.postId;
        command.username = req['user'].username;
        yield command.save();
        res.status(200).send();
    });
}
exports.addCommands = addCommands;
;
function addPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date();
        const date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        const post = new post_1.default;
        post.createdAt = date;
        post.description = req.body.description; // should do some validation on data
        post.url = req.body.url;
        post.user = req['user'].id;
        yield post.save();
        res.status(200).send();
    });
}
exports.addPost = addPost;
;
