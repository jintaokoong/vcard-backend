import { number, object } from 'yup';

export const paginationSchema = object().shape({
  page: number().moreThan(0),
  pageSize: number(),
});
