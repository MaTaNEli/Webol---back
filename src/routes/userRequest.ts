import * as express from 'express';
import * as controller from '../controller/userRequest';
import * as verify from './verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.admin, controller.postUserImage);
router.post('/addpost/:username', verify.admin, controller.addPost)
// ----------- Auth Get Routes -----------
router.get('/:username', controller.getUserPage); //"verify.connect" Need to add this as midleware

export default router;