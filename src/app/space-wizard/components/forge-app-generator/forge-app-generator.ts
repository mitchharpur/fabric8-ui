//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { IForgeCommand, IForgeCommandData, IForgeState } from '../../models/forge';

import { IWorkflow } from '../../models/workflow';

import {
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorService,
  IFieldSet
} from '../../services/app-generator.service';

export class ForgeAppGenerator {
  static instanceCount: number = 1;

  workflow: IWorkflow;
  name: string;
  state: IForgeState;

  private _fieldSet: IFieldSet;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private currentResponse: IAppGeneratorResponse;

  constructor(private _appGeneratorService: IAppGeneratorService, loggerFactory: LoggerFactory) {
    this.log = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeAppGenerator.instanceCount++);
  }

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  };

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  };

  get fieldSet(): IFieldSet {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  set fieldSet(value: IFieldSet) {
    this._fieldSet = value;
  }

  begin() {
    let request: IAppGeneratorRequest = {
      command: {
        name: `${this.name}`
      }
    };
    this.log('command being sent to the app generator service:');
    return this._appGeneratorService.getFieldSet(request)
    .subscribe(response => {
      this.log(`received a response for command = ${request.command.name}`);
      let nextCommand: IForgeCommand = response.context.nextCommand;
      let forgeCommandData: IForgeCommandData = nextCommand.parameters.data;
      this.state = forgeCommandData.state;

      if ( this.responseHistory.length > 0 ) {
        let prevResponse = this.currentResponse;
        this.responseHistory.push(prevResponse);
        this.log(`Stored fieldset[${prevResponse.payload.data.length}] into fieldset history
        ... there are ${this.responseHistory.length} items in history ...`);
      }
      this.currentResponse = response;
      this.fieldSet = response.payload.data;

    });
  }

  gotoNextStep() {
    let prevResponse = this.currentResponse;
    this.responseHistory.push(prevResponse);
    this.log(`stored fieldset[${prevResponse.payload.data.length}] into history
    ... there are ${this.responseHistory.length} items in history ...`);
    let command = this.currentResponse.context.nextCommand;
    command.parameters.inputs = this.fieldSet;
    this.log('command being sent to the app generator service:');
    console.dir(command);
    let request: IAppGeneratorRequest = {
      command: command
    };
    this._appGeneratorService.getFieldSet(request)
    .subscribe((response) => {
      this.currentResponse = response;

      this.fieldSet = response.payload.data;
    });
    // TODO: need a way to be aware that the app generator pipeline is complete
    // if(this.workflow)
    // {
    //   this.workflow.gotoNextStep();
    // }

  }

  gotoPreviousStep() {

    let response = this.responseHistory.pop();
    this.fieldSet = response.payload.data;
    this.log(`Restored fieldset[${response.payload.data.length}] from fieldset history
    ... there are ${this.responseHistory.length} items in history ...`);
  }

  execute() {

    if ( this.state && this.state.canExecute ) {

    }

  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

}
