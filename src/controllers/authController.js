import prisma from "../config/prisma.js";
import { createError } from "../utils/createError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, address} = req.body;
    console.log(req.body);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      createError(400, "User already exist !");
      res.status(400).json({message : "User already exist!"})
    }
    const hash = bcrypt.hashSync(password, 10);

    const result = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        phone: phone,
        address: address,
      },
    });
    res
      .status(200)
      .json({ message: `Register ${result.firstName} successful` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      createError(400, "Email or Password invalid");
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      createError(400, "Email or Password invalid");
    }
    const payload = {
      id: user.id,
      role : user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({
      id: user.id,
      email: user.email,
      role : user.role,
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
