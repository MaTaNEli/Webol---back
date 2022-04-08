import * as express from 'express';
import * as controller from '../controller/globalPagesRequests';
import * as verify from './verifyToken';
const router = express.Router();

// ----------- Auth Post Routes -----------
//router.post('/userimage/:image/:username', verify.admin, controller.updateUserImage);
router.post('/addcomand', verify.connect, controller.addCommands);

// ----------- Auth Get Routes -----------
router.get('/addOrDeleteLike/:postId', verify.connect, controller.addOrDeleteLike);


export default router;