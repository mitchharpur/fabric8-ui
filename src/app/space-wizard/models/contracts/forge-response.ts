export interface IForgeValueChoice {
  id: string;
  name?:string;
  description?:string;
  // other properties
  [key:string]:any;
}

export interface IForgeInput {
  name: string;
  label: string;
  description?: string;
  note?:string;
  class: string;
  value: string|Array<string>;
  valueChoices?: Array<IForgeValueChoice>;
  enabled: boolean;
  required: boolean;
  deprecated: boolean;
  version?:string;
  // other properties
  [key:string]:any;
}

export interface IForgePayload {
  metadata?: {
    deprecated: boolean;
    category: string;
    name: string;
    description: string;
    [key:string]:any;
  }
  state: {
    valid: boolean;
    canExecute: boolean;
    wizard: boolean;
    canMoveToNextStep: boolean;
    canMoveToPreviousStep: boolean;
    steps:Array<string>;
    [key:string]:any;
  }
  messages?:Array<string>;
  inputs: Array<IForgeInput>;
  [key:string]:any;
  
}


export interface IForgeResponse {
  payload: IForgePayload|any ;
}

