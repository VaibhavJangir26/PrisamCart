import {Request,Response,NextFunction} from 'express';





export const logger= (req:Request,res:Response,next:NextFunction):void => {
    console.log(req.method, req.hostname, req.path);
    next();
}
