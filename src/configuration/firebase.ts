import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

export default app;