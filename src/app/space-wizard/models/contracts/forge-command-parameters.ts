import { IForgeCommandPipeline } from './forge-command-pipeline';
import { IForgeCommandData } from './forge-command-data';

export interface IForgeCommandParameters {
  pipeline: IForgeCommandPipeline;
  commandName?: string;
  data?: IForgeCommandData;
  //other dynamic fields
  [propertyName: string]: any;
}
