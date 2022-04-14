import { object, string } from 'yup';

export const inviteUserReqSchema = object().shape({
  email: string().required().email(),
})

export interface InviteUserReq {
  email: string;
}
