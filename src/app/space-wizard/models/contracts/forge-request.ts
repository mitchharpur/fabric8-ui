export interface IForgeRequest {
  command: {
    name: string;
    parameters?: [any];
  }
  payload?: any
}
