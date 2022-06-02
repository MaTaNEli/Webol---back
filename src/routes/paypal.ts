import * as express from 'express';
import * as controller from '../controller/paypal';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
//router.post('/sendmessage', verify.connect, controller.sendMessages);

// ----------- Auth Get Routes -----------
router.get('/sign', verify.connect, controller.signToWebol);


export default router;