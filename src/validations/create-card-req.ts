import { InferType } from 'yup';
import { object, string } from 'yup';

const addressSchema = object().shape({
  label: string(),
  street: string(),
  city: string(),
  postalCode: string(),
  state: string(),
  countryCode: string(),
});

export type Address = InferType<typeof addressSchema>;

export const createCardReq = object().shape({
  firstName: string(),
  lastName: string(),
  contact: string(),
  email: string().email(),
  title: string(),
  organization: string(),
  workContact: string(),
  workEmail: string().email(),
  address: addressSchema,
  workAddress: addressSchema,
  notes: string(),
});

export type CreateCardRequest = InferType<typeof createCardReq>;
