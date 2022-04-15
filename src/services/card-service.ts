import { VcardError } from 'interfaces/shared/vcard-error';
import { VCardModel } from 'models/vcard';
import { andThen, identity, invoker, map, pipe, propOr } from 'ramda';
import { tryCatchAsync } from 'utilities/fp-utils';
import { CreateCardRequest } from 'validations/create-card-req';

const findCards = async (user: string | undefined) =>
  tryCatchAsync(
    pipe(
      () => VCardModel.find({ createdBy: user }).then(identity),
      andThen(map(invoker(0, 'toObject'))),
    ),
    (error) =>
      new VcardError(
        'server_error',
        propOr('error fetching cards', 'message')(error),
      ),
  );

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
  findCards,
};

export default cardService;
