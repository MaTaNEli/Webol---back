import * as express from 'express';
import * as s3 from '../s3Connect/s3';
import * as verify from './verifyToken';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.get('/geturl/:username',verify.admin, async (req, res) =>{
    const url = await s3.generateUploadURL(req['user'].id);
    res.status(200).json(url);
});

// ----------- Auth Get Routes -----------


export default router;