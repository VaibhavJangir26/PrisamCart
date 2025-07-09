import {Response,Request,NextFunction} from 'express';

type asyncHandler =(req:Request,res:Response,next: NextFunction)=>Promise<any>;
       

export const asyncHandlerFun =(fn: asyncHandler)=>{
    return (req:Request,res:Response,next: NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}
    
