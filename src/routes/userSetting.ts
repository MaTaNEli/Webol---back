import * as express from 'express';
import * as controller from '../controller/userSettingsRequest';
import * as verify from './verifyToken';
const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.connect, controller.updateUserImage);
router.post('/updatebio', verify.connect, controller.updateBio);
router.post('/updateusername', verify.connect, controller.updateUsername);
router.post('/updatefullname', verify.connect, controller.updateFullname);
router.post('/updatepassword', verify.connect, controller.updatePassword);
// ----------- Auth Get Routes -----------

export default router;