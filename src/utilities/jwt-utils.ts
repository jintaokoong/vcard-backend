import app from 'configuration/firebase';
import jwt from 'jsonwebtoken';
import { dec, pipe, prop } from 'ramda';

export const extract = (authorization: string) =>
  !authorization.startsWith('Bearer')
    ? new Error('Unsupported format')
    : authorization.replace('Bearer ', '');

export const safeExtract = (authorization: string) =>
  authorization.replace('Bearer ', '');

export const verify = (token: string) => {
  return app
    .auth()
    .verifyIdToken(token)
    .then((value) => value)
    .catch((error) => new Error('Decode error'));
};

export const extractId = (token: string) =>
  pipe(jwt.decode, (decoded) =>
    decoded && typeof decoded === 'object' ? prop('sub', decoded) : undefined,
  )(token);
