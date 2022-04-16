import { createCardReq } from './create-card-req';
import { InferType } from 'yup';

export const updateCardReq = createCardReq;

export type UpdateCardRequest = InferType<typeof updateCardReq>;
