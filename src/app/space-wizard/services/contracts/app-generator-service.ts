import { Observable, Observer, Subscriber } from 'rxjs/Rx';
import { OpaqueToken } from '@angular/core';

export { IFieldSet, FieldSet, IFieldInfo, FieldWidgetClassificationOptions, FieldWidgetClassification, IFieldValueOption } from '../../models/app-generator'

import { IFieldSet, IFieldInfo } from '../../models/app-generator'

/** AppGenerator contract */

export interface IAppGeneratorService {
  getFieldSet(options?: any): Observable<IAppGeneratorResponse>
}

export interface IAppGeneratorResponse
{
  payload:IFieldSet;
  context?:any;
  /** other dynamic fields */
  [key:string]:any;
}

/** AppGeneratorService contract using abstract base class */

export abstract class AppGeneratorService implements IAppGeneratorService {
  abstract getFieldSet(options?: any): Observable<IAppGeneratorResponse>;
  protected createEmptyResponse(): Observable<IAppGeneratorResponse> {
    return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
      observer.next({ payload:[],context:{}});
      observer.complete();
    });
  }

}

/**
 * service dependency injection token to be used with @Inject annotation.
 * There is some magic string badness here but typescript interface metadata
 * query is limited
 */

export const IAppGeneratorServiceToken = new OpaqueToken("IAppGeneratorService");

