import { IFieldInfo } from '../contracts/field-info';
import { IFieldSet } from '../contracts/field-set';

export { IFieldSet } from '../contracts/field-set';
export { IFieldInfo } from '../contracts/field-info';
export { IFieldValueOption } from '../contracts/field-value-option';

export { FieldWidgetClassification, FieldWidgetClassificationOptions } from '../contracts/field-classification';

export class FieldSet extends Array<IFieldInfo> implements IFieldSet {
}
