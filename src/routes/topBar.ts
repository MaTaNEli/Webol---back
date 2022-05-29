import * as express from 'express';
import * as controller from '../controller/topBarRequest';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Get Routes -----------
router.get('/getnotification', verify.connect, controller.getNotifications);
router.get('/getcountnotification', verify.connect, controller.countNotifications);
router.get('/findusers/:username/:offset', verify.connect, controller.findUsers);
router.get('/findusersbyrole/:username/:offset', verify.connect, controller.findUsersByRole);
router.get('/findposts/:description/:offset', verify.connect, controller.findPosts);
// ----------- Auth Delete Routes -----------

export default router;