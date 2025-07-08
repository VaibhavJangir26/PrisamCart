import express from 'express';

import { getAllReviews,getReviewById,updateReview,deleteReview } from '../controllers/reviews_controller';

import { z } from 'zod';
import { zodValidation } from '../middleware/zod_validate';

const reviewValidate = z.object({
    rating: z.number().min(1, "rating is required"),
    comments: z.string(),
    product_id: z.number().int("prodcut_id is required"),
    user_id: z.number().int("user_id is required")
})


const router = express.Router();

router.get("/",getAllReviews);
router.get("/id/:id",getReviewById);
router.put("/update/id/:id",zodValidation(reviewValidate),updateReview);
router.delete("/delete/id/:id",deleteReview);



export default  router;