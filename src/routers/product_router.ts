import express from 'express';
import { getAllProducts, getProductById, updateProduct, deleteProduct, filterPdt, createProduct } from '../controllers/product_controller';
import { z } from 'zod';
import { zodValidation } from '../middleware/zod_validate';
import { validationAccessToken } from '../middleware/access_token_checker';
import { roleAuth } from '../middleware/role_auth';
import { roles } from '../utils/roles';
import { asyncHandlerFun } from '../utils/async_handler';
const router = express.Router();


const pdtUpdateZodValidation = z.object({
    pirce: z.number().optional(),
    desc: z.string().optional(),
    name: z.string().optional(),
})

const pdtCreateZodValidation = z.object({
    price: z.number(),
    desc: z.string(),
    name: z.string(),
    category_id: z.number()
})



router.get("/", validationAccessToken, roleAuth([roles.Customer, roles.Admin]), asyncHandlerFun(getAllProducts));
router.get("/id/:id",validationAccessToken,roleAuth([roles.Admin,roles.Customer]), getProductById);
router.get("/filter",validationAccessToken,roleAuth([roles.Admin,roles.Customer]), filterPdt);

router.post("/create", validationAccessToken, roleAuth([roles.Admin]), zodValidation(pdtCreateZodValidation), createProduct)
router.put("/update/id/:id",validationAccessToken,roleAuth([roles.Admin]), zodValidation(pdtUpdateZodValidation), updateProduct);
router.delete("/delete/id/:id",validationAccessToken,roleAuth([roles.Admin]), deleteProduct);




export default router;