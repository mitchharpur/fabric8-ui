import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken , ReflectiveInjector } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';

import { IFieldSetService , FieldSetServiceBase  } from '../models/field-set'


export { IFieldSetService, IFieldSet, IFieldInfo } from '../models/field-set';

import { MockFieldSetService } from './field-set.service.mock'
import { FieldSetService } from './field-set.service.concrete'
import { ISpaceMagicServiceProvider, ISpaceMagicService} from './space-magic.service'

/**
 * service dependency injection helper constructs
 */
const  serviceBaseClassTypeName =  "FieldSetServiceBase";
const  serviceInterfaceTypeName = "IFieldSetService";
const  serviceInterfaceTypeToken = new OpaqueToken(serviceInterfaceTypeName);


/**
 * This function returns a function that operates as the service factory for the Service.
 * the factory creates an instance of the service , but the provider resolves either an interface
 * or an abstract base class.
 * @param typeName : the name of the type for which a factory is to be retrieved.
 * This type name if just used for logging purposes.
 */
function createServiceFactory(typeName: string) {
  let serviceFactory= () => {
    // directly use angular injector
    // TODO: use class provider to resolve dependecies vi di
    let injector=ReflectiveInjector.resolveAndCreate([FieldSetServiceProvider.ClassProvider])
    let tmp= injector.get(FieldSetServiceBase);
    // directly use angular injector
    //let injector=ReflectiveInjector.resolveAndCreate([ISpaceMagicServiceProvider.FactoryProvider])
    //let spaceMagicService= injector.get(ISpaceMagicServiceProvider.InjectToken);
    //let tmp=new FieldSetService(spaceMagicService);
    console.log(`FieldSet:serviceFactory: Resolving ${typeName} as an instance of ${tmp.constructor.name}.`);
    return tmp;
  };
  return serviceFactory;
}

function createMockServiceFactory(typeName: string) {
  let serviceFactory= () => {
    let tmp = new MockFieldSetService();
    console.log(`FieldSet:serviceFactory: Resolving ${typeName} as an instance of ${tmp.constructor.name}.`);
    return tmp;
  };
  return serviceFactory;
}


/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class IFieldSetServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { //serviceInterfaceFactoryProvider;
      provide: serviceInterfaceTypeToken,
      useFactory: createServiceFactory(serviceInterfaceTypeName)
    }
  }
  static get InjectToken(): OpaqueToken {
    return serviceInterfaceTypeToken;
  }
}
/** These providers uses the abstract base class as a contract. Does not require
 * using the @inject token to be reolved in a class that takes the service as
 * a dependency
 */
export class FieldSetServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: FieldSetServiceBase,
      useClass: FieldSetService
    }
  }
  static get MockClassProvider(): ClassProvider {
    return {
      provide: FieldSetServiceBase,
      useClass: MockFieldSetService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetServiceBase,
      useFactory: createServiceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: FieldSetServiceBase,
      useFactory: createMockServiceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
}



