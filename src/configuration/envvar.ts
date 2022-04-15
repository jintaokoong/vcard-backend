import dotenv from 'dotenv';

dotenv.config();

export const get = <T = any>(key: string, defaultValue?: T) => {
  return process.env[key] ?? defaultValue;
};

export const getOr = <T = any>(key: string, defaultValue: T) => {
  return process.env[key] ?? defaultValue;
};
