import { Injectable, FactoryProvider, ClassProvider, Type, OpaqueToken , ReflectiveInjector } from '@angular/core';
import { Observable,  Subscriber } from 'rxjs/Rx';





export { IAppGeneratorService, IAppGeneratorServiceToken, IFieldSet, IFieldInfo, AppGeneratorService } from '../models/app-generator';
import { IFieldSet,IAppGeneratorServiceToken,AppGeneratorService} from '../models/app-generator'


import { MockAppGeneratorService } from './mock/mock-app-generator.service'
import { Fabric8AppGeneratorService } from './concrete/fabric8-app-generator.service'


import { IForgeServiceProvider , IForgeService} from './forge.service'


/** When using this provider and you take a dependency on the interface type
 * it will be neccesary to use the @inject(IFieldSetServiceProvider.TypeToken)
 * annotation to resolve the dependency
 */
export class IAppGeneratorServiceProvider {
  static get FactoryProvider(): FactoryProvider {
    return { 
      provide: IAppGeneratorServiceToken,
      useFactory:(forgeGatewayService:IForgeService)=>{
        return new Fabric8AppGeneratorService(forgeGatewayService);
      },
      deps:[IForgeServiceProvider.InjectToken]
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return { 
      provide: IAppGeneratorServiceToken,
      useFactory:()=>{
        return new MockAppGeneratorService();
      }
    }
  }
  static get InjectToken(): OpaqueToken {
    return IAppGeneratorServiceToken;
  }
}
/** These providers uses the abstract base class as a contract. Does not require
 * using the @inject token to be reolved in a class that takes the service as
 * a dependency
 */
export class FieldSetServiceProvider {

  static get ClassProvider(): ClassProvider {
    return {
      provide: AppGeneratorService,
      useClass: Fabric8AppGeneratorService
    }
  }
  static get MockClassProvider(): ClassProvider {
    return {
      provide: AppGeneratorService,
      useClass: MockAppGeneratorService
    }
  }

  static get FactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory:(spaceMagicService:IForgeService)=>{ 
        return new Fabric8AppGeneratorService(spaceMagicService); 
      },
      deps: [IForgeServiceProvider.InjectToken],
      multi: false
    }
  }
  static get MockFactoryProvider(): FactoryProvider {
    return {
      provide: AppGeneratorService,
      useFactory:()=>{ 
        return new MockAppGeneratorService(); 
      },
      multi: false
    }
  }
}



