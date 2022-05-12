import * as express from 'express';
import * as controller from '../controller/userPageRequests';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/addpost', verify.connect, controller.addPost);

// ----------- Auth Get Routes -----------
router.get('/:username', verify.connect, controller.getUserPage);
router.get('/getfollowers/:username/:offset', verify.connect, controller.getFollowers);
router.get('/getmoreuserpost/:username/:offset', verify.connect, controller.getMoreUserPost);
router.get('/addordeletefollower/:userToFollowId', verify.connect, controller.addOrDeleteFollower); 
 
// ----------- Auth Delete Routes -----------
router.delete('/deletepost/:postId', verify.connect, controller.deletePost);

export default router;