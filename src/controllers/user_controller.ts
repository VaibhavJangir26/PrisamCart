import {Response,Request} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma=new PrismaClient();



export const getAllUser=async(req:Request,res:Response):Promise<void> =>{
    try {
        const data = await prisma.users.findMany({});
        res.status(200).json({mgs:"success",data: data});
    } catch (error) {
        res.status(500).json({msg:error})
    }
}

export const updateUser = async (req: Request, res: Response):Promise<void>  => {
    try {
        const { id: userId } = req.params;

        const user = await prisma.users.update({
            where: {
                id: parseInt(userId)
            },
            data: req.body
        });
        res.status(200).json({ msg: "updated reviews", data: user })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}



export const deleteUser = async (req: Request, res: Response):Promise<void>  => {
    try {
        const { id: userId } = req.params;
        const user = await prisma.users.delete({
            where: {
                id: parseInt(userId)
            }
        });
        res.status(200).json({ msg: "deleted user", data: user })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}