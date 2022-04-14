import { BaseSchema } from 'yup';

const validate =
  <TValue, TSchema extends BaseSchema>(schema: TSchema) =>
  (value: TValue) => {
    return schema.validate(value);
  };

const validationUtils = {
  validate,
};

export default validationUtils;
