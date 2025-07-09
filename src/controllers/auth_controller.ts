import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();


export const signup = async (req: Request, res: Response):Promise<void|Response>=>{
  try {
    const { email, password, role, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleEntry = await prisma.role.findUnique({
      where: { id: role }
    });

    if (!roleEntry) {
      return res.status(404).json({ msg: "Role not found" });
    }

    const newUser = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: { connect: { id: roleEntry.id } }
      }
    });

    res.status(201).json({ msg: " registered", data: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};


export const signin = async (req: Request, res: Response):Promise<void|Response>=>{
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) return res.status(404).json({ msg: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)  res.status(400).json({ msg: "invalid credentials" });

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role_id
      },
      process.env.JWT_Secret!,
      { expiresIn: "15min" }
    );

    res.status(200).json({ msg: "login successful", access_token: jwtToken });
  } catch (error) {
    res.status(500).json({ msg: "login failed", error });
  }
};
