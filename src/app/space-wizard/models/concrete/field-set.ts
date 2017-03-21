import { IFieldSet } from '../contracts/field-set';
import { IFieldInfo } from '../contracts/field-info';

export { IFieldSet } from '../contracts/field-set';
export { IFieldInfo } from '../contracts/field-info';
export { FieldClassification, FieldValueClassification } from '../contracts/field-value-classification';
export { IFieldValueOption } from '../contracts/field-value-option';

export class FieldSet extends Array<IFieldInfo> implements IFieldSet {
  /** used to ferry original contextual information that has bearing on the fieldset */
  context: {};
}