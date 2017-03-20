

export interface IFieldInfo {
  name: string;
  value: number | string | boolean | Array<any>;
  
  label: string;
  display: boolean;
  enabled: boolean;
  required: boolean;
  index: number;
  valid: boolean;
}
/** IFieldSet defines the array like shape of IFieldSet */
export interface IFieldSet extends Array<IFieldInfo>
{

}

/** FieldSet is an extended IFieldInfo array */
export class FieldSet extends Array<IFieldInfo> implements IFieldSet
{

}

