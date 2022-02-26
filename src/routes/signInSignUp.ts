
import * as express from 'express';
import * as controller from '../controller/signInSignUp';
import * as verify from './verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.post('/login', controller.logInPost);
router.post('/register', controller.registerPosts);
router.post('/googlelogin', controller.googleLogIn);
router.post('/resetpass', controller.passwordReset);
router.post('/updatenewpass', verify.resetPassToken, controller.passUpdate);

// ----------- Auth Get Routes -----------
router.post('/', (req: express.Request, res: express.Response) =>{
    console.log(req.body);
    res.status(200).json({message:"Hello Wrold"});
})

export default router;

