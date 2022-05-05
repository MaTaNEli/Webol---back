import * as express from 'express';
import * as controller from '../controller/topBarRequest';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Get Routes -----------
router.get('/getnotification', verify.connect, controller.getNotifications);
router.get('/getcountnotification', verify.connect, controller.countNotifications);
router.get('/deletenotifications', verify.connect, controller.deleteNotifications);
// ----------- Auth Delete Routes -----------

export default router;