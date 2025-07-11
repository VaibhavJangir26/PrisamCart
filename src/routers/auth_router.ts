import express from 'express';
const router = express.Router();
import {z} from "zod";


import { signin,signupAdmin,signupCustomer,logout,generateNewAccessToken } from '../controllers/auth_controller';
import { asyncHandlerFun } from '../utils/async_handler';
import { zodValidation } from '../middleware/zod_validate';



const logoutAndRefreshZodValidation= z.object({
    refresh_token: z.string()
})



router.post('/signup/admin',signupAdmin);
router.post('/signup/user',signupCustomer);

router.post('/login',asyncHandlerFun( signin));

router.post('/logout',zodValidation(logoutAndRefreshZodValidation),asyncHandlerFun(logout));
router.post('/refresh-token',zodValidation(logoutAndRefreshZodValidation),asyncHandlerFun(generateNewAccessToken));



export default router;
