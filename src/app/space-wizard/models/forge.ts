export interface IForgeResponse
{
  payload:any
}

export interface IForgeRequest
{
  command:{
    name:string;
    parameters?:[any];
  }
  payload?:any
}
