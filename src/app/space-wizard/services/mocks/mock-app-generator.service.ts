import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import {
  AppGeneratorService,
  FieldSet,
  FieldWidgetClassificationOptions,
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IFieldInfo
} from '../contracts/app-generator-service';

/** mock app generator service */

@Injectable()
export class MockAppGeneratorService extends AppGeneratorService {
  static instanceCount: number = 1;

  constructor(loggerFactory: LoggerFactory) {
    super();
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, MockAppGeneratorService.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance...`);
  }

  getFieldSet(options: IAppGeneratorRequest): Observable<IAppGeneratorResponse> {
    switch ( options.command ) {
      case 'first': {
        return getFirstFieldSet();
      }
      case 'second': {
        return getSecondFieldSet();
      }
      default: {
        return this.createEmptyResponse();
      }
    }
  }

  private log: ILoggerDelegate = () => {};

}

function getFirstFieldSet(): Observable<IAppGeneratorResponse> {
  return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
    let items: IFieldInfo[] =
      [
        {
          name: 'mock-f1',
          value: 'f1-value',
          display: {
            options: [],
            hasOptions: false,
            inputType: FieldWidgetClassificationOptions.SingleInput,
            label: 'label-f1',
            enabled: true,
            required: true,
            visible: true,
            index: 0
          }
        },
        {
          name: 'mock-f2',
          value: 'f2-value',
          display: {
            options: [],
            hasOptions: false,
            inputType: FieldWidgetClassificationOptions.SingleInput,
            label: 'label-f2',
            enabled: true,
            required: true,
            visible: true,
            index: 0
          }
        }
      ];
    let set = new FieldSet(... items);
    observer.next({ payload: { data: set } });
    observer.complete();
  });
}
function getSecondFieldSet(): Observable<IAppGeneratorResponse> {
  return Observable.create((observer: Observer<IAppGeneratorResponse>) => {
    observer.next({
                    payload: {
                      data: [
                        {
                          name: 'mock-f3',
                          value: 'f3-value',
                          display: {
                            options: [],
                            hasOptions: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f3',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        },
                        {
                          name: 'mock-f4',
                          value: 'f4-value',
                          display: {
                            options: [],
                            hasOptions: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f4',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        },
                        {
                          name: 'mock-f5',
                          value: 'f5-value',
                          display: {
                            options: [],
                            hasOptions: false,
                            inputType: FieldWidgetClassificationOptions.SingleInput,
                            label: 'label-f5',
                            enabled: true,
                            required: true,
                            visible: true,
                            index: 0
                          }
                        }
                      ]
                    }
                  });
    observer.complete();
  });
}
