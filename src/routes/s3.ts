import * as express from 'express';
import * as s3 from '../s3Connect/s3';
import * as verify from '../token/verifyToken';
import { Request, Response } from 'express';

const router = express.Router();

// ----------- Auth Post Routes -----------
router.get('/geturl',verify.connect, async (req: Request, res: Response) =>{
    const url = await s3.generateUploadURL(req['user'].id);
    res.status(200).json(url);
});

export default router;