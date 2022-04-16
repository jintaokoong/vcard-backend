import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

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
export class VCard {
  @prop({ required: true })
  label!: string;
  @prop()
  firstName?: string;
  @prop()
  lastName?: string;
  @prop()
  contact?: string;
  @prop()
  email?: string;
  @prop({ _id: false })
  address?: Address;
  @prop()
  title?: string;
  @prop()
  organization?: string;
  @prop()
  workContact?: string;
  @prop()
  workEmail?: string;
  @prop({ _id: false })
  workAddress?: Address;
  @prop()
  notes?: string;
  @prop()
  createdBy?: string;
  @prop()
  createdAt!: number;
  @prop()
  updatedAt!: number;
}

export const VCardModel = getModelForClass(VCard, {
  schemaOptions: { timestamps: { currentTime: () => Date.now() } },
});
