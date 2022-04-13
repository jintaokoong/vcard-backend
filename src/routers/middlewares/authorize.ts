import { RequestHandler } from "express";
import { extract, verify } from "utilities/jwt-utils";

export const authorize: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ message: 'missing authorization token' });
  const extraction = extract(authorization);
  if (extraction instanceof Error) {
    return res.status(401).send({ message: extraction.message });
  }
  const verification = await verify(extraction);
  if (verification instanceof Error) {
    return res.status(401).send({ messsage: verification.message });
  }
  next();
}