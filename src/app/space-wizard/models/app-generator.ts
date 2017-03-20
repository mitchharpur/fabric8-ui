import { Observable, Observer, Subscriber } from 'rxjs/Rx';
import { OpaqueToken } from '@angular/core';

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

/** AppGenerator contract */
export interface IAppGeneratorService {
  GetFieldSet(options?:any): Observable<IFieldSet>
}

/** AppGeneratorService contract using abstract base class */
export abstract class AppGeneratorService implements IAppGeneratorService {
  abstract GetFieldSet(options?:any): Observable<IFieldSet>;
}

export function createEmptyFieldSet():Observable<IFieldSet>
{
    return Observable.create((observer:Observer<IFieldSet>) => {
      observer.next([]);
      observer.complete();
    });
}

/**
 * service dependency injection token to be used with @Inject annotation. 
 * There is some magic string badness here but typescript interface metadata 
 * query is limited 
 */

export const IAppGeneratorServiceToken = new OpaqueToken("IAppGeneratorService");

