import { prop, getModelForClass } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class Address {
  @prop()
  label?: string;
  @prop()
  street?: string;
  @prop()
  city?: string;
  @prop()
  state?: string;
  @prop()
  postalCode?: string;
  @prop()
  countryCode?: string;
}

export interface VCard extends Base {}
export class VCard extends TimeStamps {
  @prop()
  firstName?: string;
  @prop()
  lastName?: string;
  @prop()
  contact?: string;
  @prop()
  email?: string;
  @prop()
  address?: Address | undefined;
  @prop()
  title?: string;
  @prop()
  organization?: string;
  @prop()
  workContact?: string;
  @prop()
  workEmail?: string;
  @prop()
  workAddress?: Address | undefined;
  @prop()
  notes?: string;
  @prop()
  createdBy?: string;
}

export const VCardModel = getModelForClass(VCard);
