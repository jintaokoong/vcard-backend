import { object, string } from 'yup';

export const inviteUserReqSchema = object().shape({
  email: string().required().email(),
  type: string().required(),
});

export interface InviteUserReq {
  email: string;
  type: string;
}
