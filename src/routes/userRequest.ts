import * as express from 'express';
import * as controller from '../controller/userPageRequests';
import * as verify from './verifyToken';
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image/:username', verify.admin, controller.updateUserImage);
router.post('/addpost/:username', verify.admin, controller.addPost);


// ----------- Auth Get Routes -----------
router.get('/:username', verify.connect, controller.getUserPage);
router.get('/deletepost/:username/:postId', verify.admin, controller.deletePost);
router.get('/addfollower/:userToFollowId', verify.connect, controller.addFollower); 

export default router;