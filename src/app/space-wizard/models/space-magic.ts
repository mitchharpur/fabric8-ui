import { Observable,  Subscriber } from 'rxjs/Rx';

export interface IMagicResponse
{
  payload:any
}

export interface ICommand
{
  name:string
  parameters?:[any]
}

export interface IMagicRequest
{
  command:ICommand
  payload?:any
}

/**
 * ISpaceMagicService contract functions as an obsidian client of sorts
 * Its is responsible for connecting with the api and retrieving
 * command results
*/
export interface ISpaceMagicService {
  ExecuteCommand(options:IMagicRequest): Observable<IMagicResponse>
}


/** SpaceMagicSevice contract using abstract base class */
export abstract class SpaceMagicServiceBase implements ISpaceMagicService {
  abstract ExecuteCommand(options:IMagicRequest): Observable<IMagicResponse>
}
