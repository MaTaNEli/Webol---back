import * as express from 'express';
import * as controller from '../controller/userPageRequests';
import * as verify from './verifyToken';
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image/:username', verify.admin, controller.updateUserImage);
router.post('/addpost/:username', verify.admin, controller.addPost);
router.post('/addcomand', verify.connect, controller.addCommands);

// ----------- Auth Get Routes -----------
router.get('/:username', verify.connect, controller.getUserPage);
router.get('/addFollower/:userToFollowId', verify.connectAndGetUser, controller.addFollower); 

export default router;