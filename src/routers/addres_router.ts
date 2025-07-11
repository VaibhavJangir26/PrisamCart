import express from 'express';
const router = express.Router();
import { string, z } from 'zod';
import { getAllAdress, getMyAdresses, filterAdress, upateAdress, createAdress, deleteAdress } from '../controllers/address_controller';
import { asyncHandlerFun } from '../utils/async_handler';
import { roleAuth } from '../middleware/role_auth';
import { validationAccessToken } from '../middleware/access_token_checker';
import { roles } from '../utils/roles';
import { zodValidation } from '../middleware/zod_validate';


const createAddressZodValidation = z.object({
    city: z.string(),
    state: z.string(),
    pincode: z.number().min(100000,"6 digit pincode is required").max(999999, "only 6 digit pincode is alowed"),
    is_deafult: z.boolean(),
    addres_lane: z.string(),
    user_id: z.number()
})
const updateAddressZodValidation = z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.number().min(100000,"6 digit pincode required").max(6, "only 6 digit pincode is alowed").optional(),
    is_deafult: z.boolean().optional(),
    addres_lane: z.string()
})


router.get("/", validationAccessToken, roleAuth([roles.Admin]), asyncHandlerFun(getAllAdress))
router.get("/filter", validationAccessToken, roleAuth([roles.Admin, roles.Customer]), asyncHandlerFun(filterAdress))
router.get("/myadd/id/:id", validationAccessToken, roleAuth([roles.Customer]), asyncHandlerFun(getMyAdresses))
router.post("/create", validationAccessToken, roleAuth([roles.Customer]), zodValidation(createAddressZodValidation), asyncHandlerFun(createAdress))
router.patch("/update/id/:id", validationAccessToken, roleAuth([roles.Customer]), zodValidation(updateAddressZodValidation), asyncHandlerFun(upateAdress))
router.delete("/delete/id/:id", validationAccessToken, roleAuth([roles.Customer]), asyncHandlerFun(deleteAdress))



export default router;