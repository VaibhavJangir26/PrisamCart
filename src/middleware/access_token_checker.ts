import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const validationAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {


        let authHeader: string = req.headers.authorization as string;
        if (!authHeader) res.status(400).json({ msg: "token is required" });
        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token, process.env.jwt_access_secret!)
        req.user = decode;
        next();


    } catch (error) {
        res.status(403).json({ msg: "access token is not correct or expire" })
    }
}
