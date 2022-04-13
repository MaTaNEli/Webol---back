import * as express from 'express';
import * as controller from '../controller/globalPagesRequests';
import * as verify from './verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/addcomment', verify.connect, controller.addComment);

// ----------- Auth Get Routes -----------
router.get('/addordeletelike/:postId', verify.connect, controller.addOrDeleteLike);
router.get('/getcomments/:postId', verify.connect, controller.getComments);
router.get('/getlikes/:postId/:offset', verify.connect, controller.getLikes);
router.get('/deletecomment/:commentId', verify.connect, controller.deleteComment);
export default router;