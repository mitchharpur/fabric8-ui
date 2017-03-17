import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken } from '@angular/core';

import { Observable,  Subscriber } from 'rxjs/Rx';

import { ISpaceMagicService , SpaceMagicServiceBase  } from '../models/space-magic'


export { ISpaceMagicService, IMagicRequest, IMagicResponse } from '../models/space-magic';

import { MockSpaceMagicService } from './space-magic.service.mock'

/**
 * service dependency injection helper constructs
 */
const  serviceBaseClassTypeName =  "SpaceMagicServiceBase";
const  serviceInterfaceTypeName = "ISpaceMagicService";
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
    let tmp = new MockSpaceMagicService();
    console.log(`SpaceMagicService:serviceFactory: Resolving ${typeName} as an instance of ${tmp.constructor.name}.`);
    return tmp;
  };
  return serviceFactory;
}

/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class ISpaceMagicServiceProvider {
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
export class SpaceMagicServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: SpaceMagicServiceBase,
      useClass: MockSpaceMagicService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: SpaceMagicServiceBase,
      useFactory: createServiceFactory(serviceBaseClassTypeName),
      deps: [],
      multi: false
    }
  }
}



