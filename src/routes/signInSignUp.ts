import * as express from 'express';
import * as controller from '../controller/signInSignUp';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/login', controller.logInPost);
router.post('/register', controller.registerPosts);
router.post('/googlelogin', controller.googleLogIn);
router.post('/resetpass', controller.passwordReset);
router.post('/updatenewpass', verify.resetPassToken, controller.passUpdate);

export default router;

