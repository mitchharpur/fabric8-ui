import { IForgeCommandData } from './forge-payload';

export interface IForgeRequest<T> {
  payload: T;
  /** Usedfor any other 'out of band' data that is contextual to the payload */
  context?: any;
  /** Other dynamic properties */
  [propertyName:string]:any;

}


