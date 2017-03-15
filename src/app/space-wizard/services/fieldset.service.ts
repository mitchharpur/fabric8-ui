import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';




/**
 * service dependency injection helper constructs
 */
let serviceBaseClassTypeName =  "FieldSetService";
let serviceInterfaceTypeName = "IFieldSetService";
let serviceInterfaceTypeToken = new OpaqueToken(serviceInterfaceTypeName);

function serviceFactory(typeName: string) {
  return () => {
    let tmp = new MockFieldSetService();
    console.log(`FieldSet:serviceFactory: Resolving ${typeName} as an instance of ${tmp.constructor.name}.`);
    return tmp;
  }
}

/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class IFieldSetServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { //serviceInterfaceFactoryProvider;
      provide: serviceInterfaceTypeToken,
      useFactory: serviceFactory(serviceInterfaceTypeName)
    }
  }
  static get TypeToken(): OpaqueToken {
    return serviceInterfaceTypeToken;
  }
}
/** These providers uses the abstract base class as a contract. Does not required
 * using the @inject token
 */
export class FieldSetServiceProvider {
  /////////////////////////////
  static get ClassProvider(): ClassProvider {
    return {
      provide: FieldSetService,
      useClass: MockFieldSetService
    }
  }
  //////////////////////////////////////////
  static get FactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetService,
      useFactory: serviceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
}


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


/** Field set interface */
export interface IFieldSetService {
  FirstFieldSet: Observable<FieldSet>
  NextFieldSet: Observable<FieldSet>
}


/** FieldSet Service contract */
export abstract class FieldSetService implements IFieldSetService {
  FirstFieldSet: Observable<FieldSet>
  NextFieldSet: Observable<FieldSet>
}


/** Mockfield set service */
@Injectable()
export class MockFieldSetService extends FieldSetService {
  constructor() { super() }
  get FirstFieldSet(): Observable<FieldSet> {
    let tmp: Observable<FieldSet> = Observable.create(subscriber => {
      let o = subscriber as Subscriber<FieldSet>;
      o.next([
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
      subscriber.complete();
    });
    return tmp;
  }
  get NextFieldSet(): Observable<FieldSet> {
    return null;//this._fieldSet;
  }
}
