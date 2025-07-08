import express from 'express';

import { getAllProducts,getProductById,updateProduct,deleteProduct,filterPdt} from '../controllers/product_controller';

import { z } from 'zod';
import { zodValidation } from '../middleware/zod_validate';

const pdtValidation = z.object({
    pirce: z.number().min(1, "price is required"),
    desc: z.string().min(1, "desc is required"),
    name: z.string().min(1, "name is required"),
})


const router = express.Router();

router.get("/",getAllProducts);
router.get("/id/:id",getProductById);
router.put("/update/id/:id",zodValidation(pdtValidation),updateProduct);
router.delete("/delete/id/:id",deleteProduct);
router.get("/filter",filterPdt);



export default  router;