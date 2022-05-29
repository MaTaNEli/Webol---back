import * as express from 'express';
import * as controller from '../controller/globalPagesRequests';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/addcomment', verify.connect, controller.addComment);

// ----------- Auth Get Routes -----------
router.get('/addordeletelike/:postId/:userId', verify.connect, controller.addOrDeleteLike);
router.get('/gethomepage/:offset', verify.connect, controller.getHomePage);
router.get('/getcomments/:postId', verify.connect, controller.getComments);
router.get('/getlikes/:postId/:offset', verify.connect, controller.getLikes);
router.get('/getcategories/:category/:offset', verify.connect, controller.getCategories);

// ----------- Auth Delete Routes -----------
router.delete('/deletecomment/:commentId', verify.connect, controller.deleteComment);

export default router;