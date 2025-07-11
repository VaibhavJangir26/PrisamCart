import { Request, Response } from 'express';
import { Address, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import cacheServices from '../utils/cache_service';
import { cacheKey } from '../utils/cachekey';

export const getAllAdress = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const cacheAddress= await cacheServices.getData<Address>(cacheKey);
        if(cacheAddress){
            return res.status(200).json({ msg: "all address", data: cacheAddress }) 
        }
        const data = await prisma.address.findMany({});
        cacheServices.setData(cacheKey,data,60);
        res.status(200).json({ msg: "all address", data: data })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}


export const filterAdress = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { limit, pincode, city, state, address } = req.params;
        let add = await prisma.address.findMany({});
        if (address && typeof address === "string") {
            add = add.filter(e => e.addres_lane.toLowerCase().startsWith(address.toLowerCase()))
        }
        if (limit && !isNaN(Number(limit))) {
            const upto = parseInt(limit as string);
            add = add.slice(0, upto)
        }
        if (city && typeof address === "string") {
            add = add.filter(e => e.city.toLowerCase().startsWith(city.toLowerCase()))
        }
        if (state && typeof address === "string") {
            add = add.filter(e => e.state.toLowerCase().startsWith(state.toLowerCase()))
        }
        if (pincode && !isNaN(Number(pincode))) {
            const zipcode = parseInt(pincode as string)
            add = add.filter(e => e.pincode === zipcode);
        }
        res.status(200).json({ msg: "seach address", data: add })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const getMyAdresses = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { id: addId } = req.params;
        const data = await prisma.address.findUnique({
            where: {
                id: parseInt(addId)
            }
        });
        res.status(200).json({ msg: "my address", data: data })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const upateAdress = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { id } = req.params;
        const { city, state, pincode, is_deafult, addres_lane } = req.body;
        const data = await prisma.address.update({
            where: {
                id: parseInt(id)
            },
            data: {
                city,
                state,
                pincode,
                is_deafult,
                addres_lane
            }
        })
        res.status(200).json({ msg: "updated address", data: data });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const deleteAdress = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { id: catId } = req.params;
        const data = await prisma.address.delete({
            where: {
                id: parseInt(catId)
            }
        })
        res.status(200).json({ msg: "success deleted", deleteData: data })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

export const createAdress = async (req: Request, res: Response): Promise<void | Response> => {
    try {
        const { city, state, pincode, is_deafult, addres_lane, user_id } = req.body;
        const data = await prisma.address.create({
            data: {
                city,
                state,
                pincode,
                is_deafult,
                addres_lane,
                user_id
            }
        })
        res.status(200).json({ msg: "address created", deleteData: data })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

