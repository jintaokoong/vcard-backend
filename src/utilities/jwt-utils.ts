import app from "configuration/firebase";

export const extract = (authorization: string) => !authorization.startsWith('Bearer') ? new Error('Unsupported format')
  : authorization.replace('Bearer ', '');

export const verify = (token: string) => {
    return app.auth().verifyIdToken(token)
    .then((value) => value)
    .catch((error) => new Error('Decode error'));
  }
