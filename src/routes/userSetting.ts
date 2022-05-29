import * as express from 'express';
import * as controller from '../controller/userSettingsRequest';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/userimage/:image', verify.connect, controller.updateUserImage);
router.put('/updatesettings', verify.connect, controller.updateSettings);

// ----------- Auth Get Routes -----------
router.get('/userinfo', verify.connect, controller.getUserInfo);
router.get('/updaterole/:role', verify.connect, controller.updateRole);
router.get('/getroles/:role/:offset', verify.connect, controller.getRoles);

export default router;

//==========================================================================
//router.put('/updatebio', verify.connect, controller.updateBio);
//router.post('/updateusername', verify.connect, controller.updateUsername);
//router.post('/updatefullname', verify.connect, controller.updateFullname);
//router.post('/updatepassword', verify.connect, controller.updatePassword);