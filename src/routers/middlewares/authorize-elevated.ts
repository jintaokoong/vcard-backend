import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { extract } from '../../utilities/jwt-utils';

const authorizeElevated: RequestHandler = (req, res, next) => {
  const { authorization = '' } = req.headers;
  const extraction = extract(authorization) as string;
  const decoded = jwt.decode(extraction);
  if (decoded == null) {
    return res.status(401).send({ message: 'wrong format' });
  }
  if (typeof decoded !== 'object') {
    return res.status(400).send({ message: 'wrong payload type' });
  }
  if (!decoded.admin) {
    return res.status(403).send({ message: 'forbidden' });
  }
  next();
}
export default authorizeElevated;
