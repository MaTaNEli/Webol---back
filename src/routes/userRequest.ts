import * as express from 'express';
import * as controller from '../controller/userPageRequests';
import * as verify from './verifyToken';
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.connect, controller.updateUserImage);
router.post('/addpost', verify.connect, controller.addPost);
router.post('/updatebio', verify.connect, controller.updateBio);
router.post('/updateusername', verify.connect, controller.updateUsername);
// ----------- Auth Get Routes -----------
router.get('/:username', verify.connect, controller.getUserPage);
router.get('/deletepost/:postId', verify.connect, controller.deletePost);
router.get('/addordeletefollower/:userToFollowId', verify.connect, controller.addOrDeleteFollower); 

export default router;