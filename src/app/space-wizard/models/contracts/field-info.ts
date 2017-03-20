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