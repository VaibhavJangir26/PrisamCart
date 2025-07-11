import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';



const prisma = new PrismaClient();

export const signupAdmin = (req: Request, res: Response) => {
  signup(req, res, 1);
}
export const signupCustomer = (req: Request, res: Response) => {
  signup(req, res, 2);
}


const signup = async (req: Request, res: Response, role_id: number): Promise<void | Response> => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: { connect: { id: role_id } }
      }
    });
    const roleName = role_id === 1 ? "Admin" : "Customer";
    res.status(201).json({ msg: `${roleName} registered`, data: newUser });
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
  }
};


export const signin = async (req: Request, res: Response): Promise<void | Response> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) return res.status(404).json({ msg: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ msg: "invalid credentials" });

    const access_token = jwt.sign(
      {
        id: user.id,
        role: user.role_id
      },
      process.env.jwt_access_secret!,
      { expiresIn: "15min" }
    );
    const refresh_token = jwt.sign(
      {
        id: user.id,
        role: user.role_id
      },
      process.env.jwt_refresh_secret!,
      { expiresIn: "7d" }
    );
    await prisma.token.create({
      data: {
        refresh_token: refresh_token,
        created_at: new Date(Date.now()),
        expire_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        user: { connect: { id: user.id } }
      }
    })
    res.status(200).json({ msg: "login successful", refresh_token: refresh_token, access_token: access_token });
  } catch (error) {
    res.status(500).json({ msg: "login failed", error });
  }
};



export const logout = async (req: Request, res: Response): Promise<void | Response> => {

  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ msg: "refresh token is required" })
    }
    jwt.verify(refresh_token, process.env.jwt_refresh_secret!);
    await prisma.token.delete({
      where: {
        refresh_token: refresh_token
      }
    })
    res.status(200).json({ msg: "logout successfully" });
  } catch (error) {
    res.status(500).json({ msg: "logout failed", error });
  }
}



export const generateNewAccessToken = async (req: Request, res: Response): Promise<void | Response> => {

  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ msg: "refresh token is required" })
    }

    const newToken = jwt.verify(refresh_token, process.env.jwt_refresh_secret!) as JwtPayload;

    const user = await prisma.users.findUnique({
      where: {
        id: newToken.id,
      }
    })
    if (!user) {
      return res.status(404).json({ msg: "user not found" })
    }
    const newAccessToken = jwt.sign({
      id: user.id,
      role: user.role_id,
    }, process.env.jwt_access_secret!, { expiresIn: "15min" }
    )
    res.status(200).json({ msg: "new access token", access_token: newAccessToken });

  } catch (error) {
    res.status(500).json({ msg: "failed to generate new access token", error });
  }
}