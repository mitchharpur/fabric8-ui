import { IForgeCommandParameters } from './forge-command-parameters';
import { IFieldSet } from './field-set';

export interface IAppGeneratorForgeCommandParameters extends IForgeCommandParameters
{
  inputs: IFieldSet

}
