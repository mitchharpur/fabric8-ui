import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { FieldSet , IFieldInfo , FieldSetService} from '../domain/field-set'

/** field set mock service */
@Injectable()
export class MockFieldSetService extends FieldSetService {
  constructor() { super() }
  get FirstFieldSet(): Observable<FieldSet> {
    let tmp: Observable<FieldSet> = Observable.create((observer:Observer<FieldSet>) => {
      observer.next([
        {
          name: "f1",
          label: "label-f1",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f1-value"
        },
        {
          name: "f2",
          label: "label-f2",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f1-value-2"
        }
      ]);
      observer.complete();
    });
    return tmp;
  }
  get NextFieldSet(): Observable<FieldSet> {
    return Observable.create((observer:Observer<FieldSet>) => {
      observer.next([
        {
          name: "f3",
          label: "label-f3",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f3-value"
        },
        {
          name: "f4",
          label: "label-f4",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f4-value-4"
        }
      ]);
      observer.complete();
    });
  }
}
