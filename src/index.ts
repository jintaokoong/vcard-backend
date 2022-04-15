import app from 'configuration/express';
import { get, getOr } from 'configuration/envvar';
import 'configuration/nodemailer';
import 'configuration/firebase';
import mongoose from 'mongoose';

mongoose
  .connect(getOr('MONGO_CONNECTION_STRING', ''), {
    user: getOr('MONGO_USER', ''),
    pass: getOr('MONGO_PASS', ''),
  })
  .then(() => {
    app.listen(get('PORT'), () => {
      console.log(`listening to port ${process.env.PORT}`);
    });
  });
