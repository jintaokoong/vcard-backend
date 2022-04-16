import app from 'configuration/express';
import { get, getOr } from 'configuration/envvar';
import 'configuration/nodemailer';
import 'configuration/firebase';
import mongoose from 'mongoose';

const HOST = getOr('HOST', '0.0.0.0');
const PORT = getOr('PORT', 4000);

mongoose
  .connect(getOr('MONGO_CONNECTION_STRING', ''), {
    user: getOr('MONGO_USER', ''),
    pass: getOr('MONGO_PASS', ''),
  })
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`listening to ${HOST}:${PORT}`);
    });
  });
