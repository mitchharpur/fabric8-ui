import { IForgeInput } from './forge-input';
import { IForgeMessage } from './forge-message';
import { IForgeMetadata } from './forge-metadata';
import { IForgeState } from './forge-state';

/**
 * The data returned from the forge http REST endpoint.
 */

export interface IForgeCommandData {
  metadata?: IForgeMetadata;
  /**
   * for forge outputs that are generated as a result of several requests to the endpoint.
   * This field gives a record of the state of the outcome i.e wizard steps and indicators
   */
  state?: IForgeState;
  /**
   * Any messages relevant to input fields
   */
  messages?: Array<IForgeMessage>;
  /**
   * The set of input fields as a response or requirement to executing a command
   */
  inputs: Array<IForgeInput>;
  [key: string]: any;
}
