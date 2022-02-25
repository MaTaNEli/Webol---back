import * as express from 'express';
import * as controller from '../controller/userRequest';
import * as verify from './verifyToken';
import { Request, Response } from 'express';
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image/:username', verify.admin, controller.postUserImage);
router.post('/addpost/:username', verify.admin, controller.addPost)
// ----------- Auth Get Routes -----------
router.get('/:username', verify.connect, controller.getUserPage); 

export default router;