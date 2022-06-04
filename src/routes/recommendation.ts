import * as express from 'express';
import * as controller from '../controller/recommendation';
import * as verify from '../token/verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.get('/getrecommendpost/:category/:offset', verify.connect, controller.globalPostRecommendation);
// ----------- Auth Get Routes -----------
router.get('/getrecommend', verify.connect, controller.globalUsersRecommendation);

export default router;