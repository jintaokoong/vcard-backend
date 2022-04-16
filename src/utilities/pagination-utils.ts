import { __, always, divide, pipe, when } from 'ramda';

const calculatePages = (pageSize: number) => (totalCount: number) =>
  pipe(divide(__, pageSize), when(isNaN, always(0)), Math.ceil)(totalCount);

const paginationUtils = {
  calculatePages,
};

export default paginationUtils;
