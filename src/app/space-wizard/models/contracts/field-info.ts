import { IFieldValueOption} from './field-value-option'; 
import { FieldWidgetClassification} from './field-classification'; 

export interface IFieldInfo {
  name: string;
  value:any; //string | Array<IFieldValueOption>;
  valueDataType?:string;
  display: {
    valueOptions?: Array<IFieldValueOption>;
    valueHasOptions: boolean;
    widgetClassification: FieldWidgetClassification;
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