import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



export const getAllReviews = async (req: Request, res: Response):Promise<void>  => {
    try {
        const review = await prisma.reviews.findMany({});
        res.status(200).json({ msg: "all reviews", data: review })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


export const getReviewById = async (req: Request, res: Response) :Promise<void> => {
    try {
        const { id: reviewId } = req.params;
        const review = await prisma.reviews.findUnique({
            where: {
                id: parseInt(reviewId)
            }
        });
        res.status(200).json({ msg: "review by id", data: review })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



export const updateReview = async (req: Request, res: Response):Promise<void>  => {
    try {
        const { id: reviewId } = req.params;

        const review = await prisma.reviews.update({
            where: {
                id: parseInt(reviewId)
            },
            data: req.body
        });
        res.status(200).json({ msg: "updated reviews", data: review })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



export const deleteReview = async (req: Request, res: Response):Promise<void>  => {
    try {
        const { id: reviewId } = req.params;
        const review = await prisma.reviews.delete({
            where: {
                id: parseInt(reviewId)
            }
        });
        res.status(200).json({ msg: "deleted reviews", data: review })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



