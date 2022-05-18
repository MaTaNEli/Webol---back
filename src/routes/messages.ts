import * as express from 'express';
import * as controller from '../controller/messages';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/sendmessage', verify.connect, controller.sendMessages);

// ----------- Auth Get Routes -----------
router.get('/check', verify.connect, controller.checkMessages);
router.get('/getusersmessages', verify.connect, controller.getUsersUnreadMessages);
router.get('/getmessages/:senderId/:offset', verify.connect, controller.getMessages);

export default router;