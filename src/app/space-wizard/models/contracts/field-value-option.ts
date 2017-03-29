export interface IFieldValueOption {
  id: string;
  description?: string;
  selected: boolean;
  visible:boolean
  // other properties
  [key: string]: any;
}
