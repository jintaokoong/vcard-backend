import VC from 'vcard-creator';
import { VCard } from '../models/vcard';

const generateVcf = (card: VCard) => {
  const vcard = new VC('vcard');

  vcard.addName(card.lastName, card.firstName);
  card.email && vcard.addEmail(card.email);
  card.contact && vcard.addPhoneNumber(card.contact);
  card.address &&
    vcard.addAddress(
      card.address.label,
      undefined,
      card.address.street,
      card.address.city,
      card.address.state,
      card.address.postalCode,
      card.address.countryCode,
    );

  card.organization && vcard.addCompany(card.organization);
  card.title && vcard.addJobtitle(card.title);
  card.workEmail && vcard.addEmail(card.workEmail, 'WORK');
  card.workContact && vcard.addPhoneNumber(card.workContact, 'PREF;WORK');
  card.workAddress &&
    vcard.addAddress(
      card.workAddress.label,
      undefined,
      card.workAddress.street,
      card.workAddress.city,
      card.workAddress.state,
      card.workAddress.postalCode,
      card.workAddress.countryCode,
      'WORK',
    );

  card.notes && vcard.addNote(card.notes);
  return vcard.buildVCard();
};

const vcfUtils = { generateVcf };

export default vcfUtils;
