import { IFieldValueOption} from './field-value-option'; 
import { FieldValueClassification} from './field-value-classification'; 

export interface IFieldInfo {
  name: string;
  value:any; //string | Array<IFieldValueOption>;
  display: {
    valueOptions: Array<IFieldValueOption>;
    valueHasOptions: boolean;
    valueClassification: FieldValueClassification;
    label: string;
    enabled: boolean;
    required: boolean;
    visible: boolean;
    index: number;
    // other properties
    [key: string]: any;
  }
  context?: any;
  // other properties
  [key: string]: any;
}