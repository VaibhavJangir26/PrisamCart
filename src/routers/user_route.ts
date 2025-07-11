import express from 'express';

import { getAllUser,updateUser,deleteUser,getMyProfile } from '../controllers/user_controller';

const router=express.Router();


import {string, z} from 'zod';
import { zodValidation } from '../middleware/zod_validate';

const userSchema= z.object({
    email: string().email("email format is not correct"),
    role: string().min(1,"role is required"),
    name: string().optional()
})


import { roleAuth } from '../middleware/role_auth';
import { validationAccessToken } from '../middleware/access_token_checker';
import { roles } from '../utils/roles';

router.get("/",validationAccessToken,roleAuth([roles.Admin]),getAllUser)

router.get("/myprofile/id/:id",validationAccessToken,roleAuth([roles.Customer]),getMyProfile)

router.put("/update/id/:id",zodValidation(userSchema),validationAccessToken,roleAuth([roles.Customer]),updateUser)
router.delete("/delete/id/:id",validationAccessToken,roleAuth([roles.Admin,roles.Customer]),deleteUser)






export default router;