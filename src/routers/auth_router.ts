import express from 'express';
const router = express.Router();


import { signin, signup } from '../controllers/auth_controller';
import { asyncHandlerFun } from '../utils/async_handler';




router.post('/login/admin',asyncHandlerFun( signin));
router.post('/login/user',asyncHandlerFun( signin));

router.post('/signup/admin',asyncHandlerFun( signup));
router.post('/signup/user',asyncHandlerFun( signup));




export default router;
