import express from 'express';

import { getAllUser,updateUser,deleteUser } from '../controllers/user_controller';

const router=express.Router();


import {string, z} from 'zod';
import { zodValidation } from '../middleware/zod_validate';

const userSchema= z.object({
    email: string().email("email format is not correct"),
    role: string().min(1,"role is required"),
    name: string().optional()
})


router.get("/",getAllUser)
router.put("/update/id/:id",zodValidation(userSchema),updateUser)
router.delete("/delete/id/:id",deleteUser)






export default router;