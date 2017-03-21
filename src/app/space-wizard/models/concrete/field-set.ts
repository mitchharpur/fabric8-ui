import { IFieldSet } from '../contracts/field-set';
import { IFieldInfo } from '../contracts/field-info';

export { IFieldSet } from '../contracts/field-set';
export { IFieldInfo, FieldWidgetType, WidgetType, IFieldOption } from '../contracts/field-info';

export class FieldSet extends Array<IFieldInfo> implements IFieldSet {
  context: {};
}