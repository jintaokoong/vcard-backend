import { VcardError } from 'interfaces/shared/vcard-error';
import { VCardModel } from 'models/vcard';
import { andThen, invoker, pipe, propOr } from 'ramda';
import { tryCatchAsync } from 'utilities/fp-utils';
import { CreateCardRequest } from 'validations/create-card-req';

const createCard = async (
  createRequest: CreateCardRequest,
  user: string | undefined,
) => {
  console.log(user);
  const card = new VCardModel({ ...createRequest, createdBy: user });
  return tryCatchAsync(
    pipe(() => card.save(), andThen(invoker(0, 'toObject'))),
    (error) => {
      return new VcardError(
        'persistence_error',
        propOr('error saving model', 'message')(error),
      );
    },
  );
};

const cardService = {
  createCard,
};

export default cardService;
