import { Router } from 'express';
import { Either } from 'interfaces/fp/either';
import { VcardError } from 'interfaces/shared/vcard-error';
import { VCardModel } from 'models/vcard';
import { compose, map, pipe } from 'ramda';
import { authorize } from 'routers/middlewares/authorize';
import cardService from 'services/card-service';
import validationService from 'services/validation-service';
import { extract, extractId, safeExtract } from 'utilities/jwt-utils';
import { createCardReq, CreateCardRequest } from 'validations/create-card-req';

const router = Router();

router.use(authorize);

router.get('/', async (req, res) => {
  const user = compose(extractId, safeExtract)(req.headers.authorization!);
  const fetchResult = await cardService.findCards(user);
  if (fetchResult._tag === 'Left') {
    return res.status(500).send(fetchResult.value.getSelf());
  }
  return res.send({ data: fetchResult.value });
});

router.post('/', async (req, res) => {
  const {
    body,
    headers: { authorization },
  } = req;
  const user = extractId(extract(authorization!) as string);
  const validationResult: Either<VcardError, CreateCardRequest> =
    await validationService.validate<
      typeof body,
      typeof createCardReq,
      CreateCardRequest
    >(createCardReq)(body);
  if (validationResult._tag === 'Left') {
    return res.status(400).send(validationResult.value.getSelf());
  }
  console.log(validationResult.value);

  const createResult = await cardService.createCard(
    validationResult.value,
    user,
  );
  if (createResult._tag === 'Left') {
    return res.status(500).send(createResult.value.getSelf());
  }
  return res.send(createResult.value);
});

router.delete('/:id', async (req, res) => {
  const {
    params: { id },
    headers: { authorization },
  } = req;
  const user = compose(extractId, safeExtract)(authorization!);
  const deleteResult = await cardService.deleteCard(id, user);
  if (deleteResult._tag === 'Left') {
    return res.status(500).send(deleteResult.value.getSelf());
  }
  return res.send();
});

export default router;
