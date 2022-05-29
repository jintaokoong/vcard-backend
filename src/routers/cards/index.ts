import { Router } from 'express';
import { Either } from 'interfaces/fp/either';
import { VcardError } from 'interfaces/shared/vcard-error';
import { compose } from 'ramda';
import { authorize } from 'routers/middlewares/authorize';
import cardService from 'services/card-service';
import validationService from 'services/validation-service';
import { extract, extractId, safeExtract } from 'utilities/jwt-utils';
import { createCardReq, CreateCardRequest } from 'validations/create-card-req';
import vcfUtils from '../../utilities/vcf-utils';
import { paginationSchema } from '../../validations/listing-schema';
import {
  updateCardReq,
  UpdateCardRequest,
} from '../../validations/update-card-req';

const router = Router();

/**
 * Export VCF
 */
router.get('/export/:id', async (req, res) => {
  const fetchResult = await cardService.getCard(req.params.id);
  if (fetchResult._tag === 'Left')
    return res.status(500).send(fetchResult.value.getSelf());
  if (fetchResult.value === null) return res.status(404);
  const vcfText = vcfUtils.generateVcf(fetchResult.value);
  res.attachment('contact-details.vcf');
  res.type('text/vcard');
  return res.send(vcfText);
});

/**
 * GET Card :id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const fetchResult = await cardService.getCard(id);
  if (fetchResult._tag === 'Left') {
    return res.status(500).send(fetchResult.value.getSelf());
  }
  if (fetchResult.value == null) {
    return res
      .status(404)
      .send(new VcardError('server_error', 'not found.').getSelf());
  }
  return res.send({ data: fetchResult.value });
});

router.use(authorize);

/**
 * GET List Cards
 */
router.get('/', async (req, res) => {
  const pagination = { page: req.query.page, pageSize: req.query.pageSize };
  const paginationValidationResult = await validationService.validate(
    paginationSchema,
  )(pagination);
  if (paginationValidationResult._tag === 'Left') {
    return res.status(400).send(paginationValidationResult.value.getSelf());
  }
  const user = compose(extractId, safeExtract)(req.headers.authorization!);
  const fetchResult = await cardService.listCards(
    { pagination: paginationValidationResult.value },
    user,
  );
  if (fetchResult._tag === 'Left') {
    return res.status(500).send(fetchResult.value.getSelf());
  }
  const totalPagesResult = await cardService.getTotalPages(
    { pagination: paginationValidationResult.value },
    user,
  );
  if (totalPagesResult._tag === 'Left') {
    return res.status(500).send(totalPagesResult.value.getSelf());
  }
  return res.send({ data: fetchResult.value, ...totalPagesResult.value });
});

/**
 * POST Create new Card
 */
router.post('/', async (req, res) => {
  const {
    body,
    headers: { authorization },
  } = req;
  const user = extractId(extract(authorization!) as string);
  const validationResult: Either<VcardError, CreateCardRequest> =
    await validationService.validate<typeof body, typeof createCardReq>(
      createCardReq,
    )(body);
  if (validationResult._tag === 'Left') {
    return res.status(400).send(validationResult.value.getSelf());
  }

  const createResult = await cardService.createCard(
    validationResult.value,
    user,
  );
  if (createResult._tag === 'Left') {
    return res.status(500).send(createResult.value.getSelf());
  }
  return res.send(createResult.value);
});

/**
 * DELETE delete card
 */
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

/**
 * PUT update card
 */
router.put('/:id', async (req, res) => {
  const {
    body,
    params,
    headers: { authorization },
  } = req;
  const user = extractId(extract(authorization!) as string);
  const validationResult: Either<VcardError, UpdateCardRequest> =
    await validationService.validate<typeof body, typeof updateCardReq>(
      updateCardReq,
    )(body);
  if (validationResult._tag === 'Left') {
    return res.status(400).send(validationResult.value.getSelf());
  }

  const updateResult = await cardService.updateCard(
    params.id,
    validationResult.value,
    user,
  );
  if (updateResult._tag === 'Left') {
    return res.status(500).send(updateResult.value.getSelf());
  }

  res.send(updateResult.value);
});

export default router;
