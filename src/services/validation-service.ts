import { BaseSchema, ValidationError } from 'yup';
import validationUtils from '../utilities/validation-utils';
import { tryCatchAsync } from '../utilities/fp-utils';
import { VcardError } from '../interfaces/shared/vcard-error';

const validate =
  <TValue, TSchema extends BaseSchema, TOutput>(schema: TSchema) =>
  (value: TValue) =>
    tryCatchAsync<VcardError, TOutput>(
      () => validationUtils.validate(schema)(value),
      (error: ValidationError) => {
        return new VcardError('validation_error', error.errors.join(', '));
      },
    );

const validationService = {
  validate,
};

export default validationService;
