import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { IFieldSet, IFieldInfo, FieldSet, AppGeneratorService } from '../contracts/app-generator-service'
import { getLogger, ILoggerDelegate } from '../../common/logger';

/** mock app generator service */

@Injectable()
export class MockAppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;
  private log: ILoggerDelegate = () => { };

  constructor() {
    super()
    this.log = getLogger(this.constructor.name, MockAppGeneratorService.instanceCount++);
    this.log(`New instance...`);

  }
  getFieldSet(options: any = {}): Observable<IFieldSet> {
    switch (options.command) {
      case "first":
        {
          return getFirstFieldSet();
        }
      case "second":
        {
          return getSecondFieldSet();
        }
      default: {
        return this.createEmptyFieldSet();
      }
    }
  }
}


function getFirstFieldSet(): Observable<IFieldSet> {
  let tmp: Observable<IFieldSet> = Observable.create((observer: Observer<IFieldSet>) => {
    let items: IFieldInfo[] =
      [
        {
          name: "mock-f1",
          label: "label-f1",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f1-value"
        },
        {
          name: "mock-f2",
          label: "label-f2",
          display: true,
          enabled: true,
          required: true,
          index: 0,
          valid: true,
          value: "f1-value-2"
        }
      ];
    let set = new FieldSet(...items);
    observer.next(set);
    observer.complete();
  });
  return tmp;
}
function getSecondFieldSet(): Observable<IFieldSet> {
  return Observable.create((observer: Observer<IFieldSet>) => {
    observer.next([
      {
        name: "mock-f3",
        label: "label-f3",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f3-value"
      },
      {
        name: "mock-f4",
        label: "label-f4",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f4-value-4"
      },
      {
        name: "mock-f5",
        label: "label-f5",
        display: true,
        enabled: true,
        required: true,
        index: 0,
        valid: true,
        value: "f5-value-5"
      }
    ]);
    observer.complete();
  });
}
