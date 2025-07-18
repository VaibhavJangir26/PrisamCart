import { Request, Response } from 'express';
import { PrismaClient, Products } from '@prisma/client';
const prisma = new PrismaClient();
import cacheServices from '../utils/cache_service';
import { cacheKey } from '../utils/cachekey';



export const getAllProducts = async (req: Request, res: Response): Promise<void|Response> => {
    try {
        let cachePdt = await cacheServices.getData<Products>(cacheKey);
        if (cachePdt) {
         return  res.status(200).json({ msg: "all pdt", data: cachePdt })
        }
        const pdt = await prisma.products.findMany({});
        cacheServices.setData(cacheKey, pdt, 60)
        res.status(200).json({ msg: "all pdt", data: pdt })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: pdtId } = req.params;
        const pdt = await prisma.products.findUnique({
            where: {
                id: parseInt(pdtId)
            }
        });
        res.status(200).json({ msg: "product by id", data: pdt })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: reviewId } = req.params;

        const pdt = await prisma.products.update({
            where: {
                id: parseInt(reviewId)
            },
            data: req.body
        });
        res.status(200).json({ msg: "updated product", data: pdt })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: pdtId } = req.params;
        const pdt = await prisma.products.delete({
            where: {
                id: parseInt(pdtId)
            }
        });
        res.status(200).json({ msg: "deleted pdt", data: pdt })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const filterPdt = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, limit } = req.query;
        let pdt = await prisma.products.findMany({});
        if (search && typeof search === 'string') {
            pdt = pdt.filter(e => e.name.toLowerCase().startsWith(search.toLowerCase()));
        }
        if (limit && !isNaN(Number(limit))) {
            const lim = parseInt(limit as string);
            pdt = pdt.slice(0, lim);
        }
        res.status(200).json({ msg: "filter pdt", data: pdt });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};



export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, desc, category_id } = req.body;

        const createPdt = await prisma.products.create({
            data: {
                name,
                price,
                desc,
                category_id
            }
        });
        res.status(201).json({ msg: "pdt created", data: createPdt })
    } catch (error) {
        res.status(500).json({ msg: error });
    }

}