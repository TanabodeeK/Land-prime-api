import jwt, { decode } from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const authUserCheck = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    console.log("header",header)
    if (!header) {
      createError(400, "token is missing");
    }
    console.log(header)


    const token = header.split(" ")[1];
    console.log("token",token)

    jwt.verify(token, process.env.SECRET, (error, decode) => {
      if (error) {
        createError(401, "token is  invalid");
      }
      req.user = decode;
    });
    next()
  } catch (error) {
    console.log(error);
    next(error);
  }
};
