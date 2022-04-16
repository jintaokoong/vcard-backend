import app from 'configuration/firebase';
import jwt from 'jsonwebtoken';
import { pipe, prop, propOr } from 'ramda';

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
    .catch(
      (error) => new Error(propOr('Unable to verify token', 'message')(error)),
    );
};

export const extractId = (token: string) =>
  pipe(jwt.decode, (decoded) =>
    decoded && typeof decoded === 'object' ? prop('sub', decoded) : undefined,
  )(token);
