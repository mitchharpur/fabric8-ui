import { Observable,  Subscriber } from 'rxjs/Rx';

export class IFieldInfo {
  name: string;
  label: string;
  display: boolean;
  enabled: boolean;
  required: boolean;
  index: number;
  valid: boolean;
  value: number | string | boolean | Array<any>;
}

export class FieldSet extends Array<IFieldInfo>
{

}

/** Field set contrace using interface */
export interface IFieldSetService {
  FirstFieldSet: Observable<FieldSet>
  NextFieldSet: Observable<FieldSet>
}


/** FieldSet Service contract using abstract base class */
export abstract class FieldSetService implements IFieldSetService {
  FirstFieldSet: Observable<FieldSet>
  NextFieldSet: Observable<FieldSet>
}
