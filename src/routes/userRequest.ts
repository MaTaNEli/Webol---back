import * as express from 'express';
import * as controller from '../controller/userRequest';
import * as verify from './verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.token, controller.postUserImage);

// ----------- Auth Get Routes -----------
router.get('/userimage/:image', verify.token, controller.getUserImage);

export default router;