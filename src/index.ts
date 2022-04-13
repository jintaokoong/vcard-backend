import app from 'configuration/express';
import 'configuration/firebase';

app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
})