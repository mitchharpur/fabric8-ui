import { OpaqueToken } from '@angular/core';
import { Observable,  Subscriber } from 'rxjs/Rx';

import { IForgeRequest } from '../../models/forge-request';
import { IForgeResponse } from '../../models/forge-response';

export { IForgeRequest } from '../../models/forge-request';
export { IForgeResponse } from '../../models/forge-response';

/**
 * IForgeRequest contract functions as an forge client of sorts
 * Its is responsible for connecting with the api and retrieving
 * command results
*/
export interface IForgeService {
  ExecuteCommand(options:IForgeRequest): Observable<IForgeResponse>
}


/** ForgeService contract using abstract base class */
export abstract class ForgeService implements IForgeService {
  abstract ExecuteCommand(options:IForgeRequest): Observable<IForgeResponse>
}

/**
 * service dependency injection token to be used with @Inject annotation.
 * There is soome magic string badness here but typescript interface metadata
 * query is limited
 */

export const IForgeServiceToken = new OpaqueToken("IForgeService");
