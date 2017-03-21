export interface IFieldOption
{
    id:any;
    description:string;
}

export type WidgetType="singleSelection"|"multipleSelection"|"textInput";

export class FieldWidgetType
{
  static SingleSelection:WidgetType="singleSelection";
  static MultipleSelection:WidgetType="singleSelection";
  static TexInput:WidgetType="textInput";
}

export interface IFieldInfo {
  name: string;
  value: number | string | boolean |Array<IFieldOption> ;
  display:{
    valueOptions: Array<any>;
    hasOptions:boolean;
    widget:WidgetType;
    label: string;
    enabled: boolean;
    required: boolean;
    visible:boolean;
    index:number;
  }
  context?:any;
}