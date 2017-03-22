import { IFieldValueOption} from './field-value-option'; 
import { FieldClassification} from './field-classification'; 

export interface IFieldInfo {
  name: string;
  value:any; //string | Array<IFieldValueOption>;
  display: {
    valueOptions?: Array<IFieldValueOption>;
    valueHasOptions: boolean;
    valueClassification: FieldClassification;
    label: string;
    enabled: boolean;
    required: boolean;
    visible: boolean;
    index: number;
    // other dynamic properties
    [key: string]: any;
  }
  // other dynamic properties
  [key: string]: any;
}