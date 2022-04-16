import { VcardError } from 'interfaces/shared/vcard-error';
import { VCardModel } from 'models/vcard';
import {
  __,
  always,
  andThen,
  assoc,
  compose,
  defaultTo,
  identity,
  invoker,
  map,
  pathOr,
  pipe,
  propOr,
} from 'ramda';
import { tryCatchAsync } from 'utilities/fp-utils';
import { CreateCardRequest } from 'validations/create-card-req';
import { ListingOptions } from '../interfaces/listings/listing-options';
import paginationUtils from '../utilities/pagination-utils';

const listCards = async (
  options: ListingOptions<never>,
  user: string | undefined,
) => {
  const page = pathOr(1, ['pagination', 'page'])(options);
  const pageSize = pathOr(10, ['pagination', 'pageSize'])(options);
  return tryCatchAsync(
    pipe(
      () =>
        VCardModel.find({ createdBy: user })
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .then(identity),
      andThen(map(invoker(0, 'toObject'))),
    ),
    (error) =>
      new VcardError(
        'server_error',
        propOr('error fetching cards', 'message')(error),
      ),
  );
};

const getTotalPages = async (
  options: ListingOptions<never>,
  user: string | undefined,
) => {
  const pagination = {
    page: defaultTo(1, options?.pagination?.page),
    pageSize: defaultTo(10, options?.pagination?.pageSize),
  };
  return tryCatchAsync(
    pipe(
      () => VCardModel.count({ createdBy: user }).then(identity),
      andThen(
        pipe(
          paginationUtils.calculatePages(pagination.pageSize),
          assoc('totalPages', __, pagination),
        ),
      ),
    ),
    (error) =>
      new VcardError(
        'server_error',
        propOr('error calculating pages', 'message')(error),
      ),
  );
};

const findCards = async (user: string | undefined) =>
  tryCatchAsync(
    pipe(
      () => VCardModel.find({ createdBy: user }).then(identity),
      andThen(map(compose(invoker(0, 'toObject')))),
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

const deleteCard = async (id: string, user: string | undefined) => {
  return tryCatchAsync(
    pipe(
      () => VCardModel.deleteOne({ _id: id, createdBy: user }).exec(),
      andThen(always(undefined)),
    ),
    pipe(
      propOr('error deleting card', 'message'),
      (message: string) => new VcardError('persistence_error', message),
    ),
  );
};

const cardService = {
  listCards,
  getTotalPages,
  createCard,
  findCards,
  deleteCard,
};

export default cardService;
