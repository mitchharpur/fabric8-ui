import { IForgeInput } from './forge-input';
import { IForgeState } from './forge-state';
import { IForgeMetadata } from './forge-metadata';

export interface IForgePayload {
  metadata?:IForgeMetadata;
  state:IForgeState;
  messages?: Array<string>;
  inputs: Array<IForgeInput>;
  [key: string]: any;
}
