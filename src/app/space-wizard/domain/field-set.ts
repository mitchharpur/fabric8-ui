import { Observable,  Subscriber } from 'rxjs/Rx';

export interface IFieldInfo {
  name: string;
  label: string;
  display: boolean;
  enabled: boolean;
  required: boolean;
  index: number;
  valid: boolean;
  value: number | string | boolean | Array<any>;
}
/** IFieldSet defines the array like shape of IFieldSet */
export interface IFieldSet extends Array<IFieldInfo>
{

}
/** FieldSet is an extended IFieldInfo array */
export class FieldSet extends Array<IFieldInfo> implements IFieldSet
{

}

/** FieldSetService contract */
export interface IFieldSetService {
  GetFieldSet(options?:any): Observable<IFieldSet>
}


/** FieldSetService contract using abstract base class */
export abstract class FieldSetServiceBase implements IFieldSetService {
  abstract GetFieldSet(options?:any): Observable<IFieldSet>;
}
