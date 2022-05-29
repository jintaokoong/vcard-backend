import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { getOr } from './envvar';

dotenv.config();

const app = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(getOr('GOOGLE_CONFIG_BASE64', ''), 'base64').toString(
        'ascii',
      ),
    ),
  ),
});

export default app;
