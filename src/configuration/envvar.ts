import dotenv from 'dotenv';

dotenv.config();

export const get = (key: string) => {
  return process.env[key];
}
