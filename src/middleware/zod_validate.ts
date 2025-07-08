import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject, ZodRawShape } from 'zod';

export function zodValidation<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {

      req.body = schema.parse(req.body);
      next();
      
    } catch (error) {

      if (error instanceof ZodError) {
        res.status(400).json({error: "validation error body required",msg: error});
      } else {
        next(error);
      }

    }
  };
}
