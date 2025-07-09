import { Request, Response, NextFunction } from 'express';


export const roleAuth = (rbac: number[]) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any;

    if (!user?.role || !rbac.includes(user.role)) {
       res.status(403).json({ msg: "access denied" });
    }

    next();
    return Promise.resolve();
  };
};
