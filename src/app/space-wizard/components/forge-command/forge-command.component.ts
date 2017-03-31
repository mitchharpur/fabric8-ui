import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
//
import { ILoggerDelegate, LoggerFactory } from '../../common/logger';
import { INotifyPropertyChanged } from '../../core/component';
import { IForgeCommand, IForgeCommandData, IForgeState } from '../../models/forge';

import { IWorkflow, IWorkflowTransition, WorkflowTransitionDirection } from '../../models/workflow';

import {
  IAppGeneratorRequest,
  IAppGeneratorResponse,
  IAppGeneratorService,
  IAppGeneratorServiceProvider,
  IFieldInfo,
  IFieldSet,
  IFieldValueOption
} from '../../services/app-generator.service';

class ForgeAppGenerator {
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
    // need a way to say the command is complete
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
  private log: ILoggerDelegate = () => {};

}

@Component({
             host: {
               'class': 'wizard-step'
             },
             selector: 'forge-command',
             templateUrl: './forge-command.component.html',
             styleUrls: [ './forge-command.component.scss' ],
             providers: [ IAppGeneratorServiceProvider.FactoryProvider ]
           })
export class ForgeCommandComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 1;

  public forge: ForgeAppGenerator = null;
  @Input() title: string = 'Forge Command Wizard';
  @Input() stepName: string = '';
  @Input() commandName: string = '';

  private _workflow: IWorkflow;
  private _fieldSet: IFieldSet;
  private _responseHistory: Array<IAppGeneratorResponse>;
  private currentResponse: IAppGeneratorResponse;

  constructor(
    @Inject(IAppGeneratorServiceProvider.InjectToken) private _appGeneratorService: IAppGeneratorService,
    loggerFactory: LoggerFactory) {
    let logger = loggerFactory.createLoggerDelegate(this.constructor.name, ForgeCommandComponent.instanceCount++);
    if ( logger ) {
      this.log = logger;
    }
    this.log(`New instance ...`);
    this.forge = new ForgeAppGenerator(this._appGeneratorService, loggerFactory);
  }

  @Input()
  get workflow(): IWorkflow {
    return this._workflow;
  }

  set workflow(value: IWorkflow) {
    this._workflow = value;
  };

  /**
   * All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog
   * is opened.
   */
  ngOnInit() {
    this.log(`ngOnInit ...`);
    this.forge.name = this.commandName;
    this.forge.workflow = this.workflow;
  }

  ngOnDestroy() {
    this.log(`ngOnDestroy ...`);
  }

  /** handle all changes to @Input properties */
  ngOnChanges(changes: SimpleChanges) {
    for ( let propName in changes ) {
      if ( changes.hasOwnProperty(propName) ) {
        this.log(`ngOnChanges ...${propName}`);
        switch ( propName.toLowerCase() ) {
          case 'workflow': {
            let change: INotifyPropertyChanged<IWorkflow> = <any>changes[ propName ];
            this.onWorkflowPropertyChanged(change);
            break;
          }
          default : {
            break;
          }
        }
      }
    }
  }

  allOptionsSelected(field: IFieldInfo): boolean {
    return !field.display.options.find((i) => i.selected === false);
  }

  selectOption(field: IFieldInfo, option: IFieldValueOption) {
    option.selected = true;
    this.updateFieldValue(field);
  }

  deselectOption(field: IFieldInfo, option: IFieldValueOption) {
    option.selected = false;
    this.updateFieldValue(field);
  }

  updateFieldValue(field: IFieldInfo): IFieldInfo {
    if ( !field ) {
      return null;
    }
    field.value = field.display.options
    .filter((o) => o.selected)
    .map((o) => o.id);
    return field;
  }

  deselectAllOptions(field: IFieldInfo) {
    field.display.options.forEach((o) => {
      o.selected = false;
    });
  }

  filterUnselectedList(field: IFieldInfo, filter: string) {
    let r = new RegExp(filter || '', 'ig');
    field.display.options.filter((o) => {
      o.visible = false;
      return ((o.id.match(r)) || []).length > 0;
    })
    .forEach(o => {
      o.visible = true;
    });

  }

  selectAllOptions(field: IFieldInfo) {
    field.display.options.forEach((o) => {
      o.selected = true;
    });
  }

  toggleSelectAll(field: IFieldInfo) {
    if ( !field ) {
      return;
    }
    // at least one not selected, then select all , else deselect all
    let item = field.display.options.find((i) => i.selected === false);
    if ( item ) {
      for ( let o of field.display.options ) {
        o.selected = true;
      }
    } else {
      for ( let o of field.display.options ) {
        o.selected = false;
      }
    }
    this.updateFieldValue(field);
  }

  get fieldSet(): IFieldSet {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }

  set fieldSet(value: IFieldSet) {
    this._fieldSet = value;
  }

  private onWorkflowPropertyChanged(change?: INotifyPropertyChanged<IWorkflow>) {
    if ( change ) {
      if ( change.currentValue !== change.previousValue ) {
        this.log(`The workflow property changed value ...`);
        let current: IWorkflow = change.currentValue;
        this.forge.workflow = current;
        this.subscribeToWorkflowTransitions(current);
      }
    }
  };

  private isTransitioningToThisStep(transition: IWorkflowTransition): boolean {
    return transition.to && transition.to.name.toLowerCase() === this.stepName.toLowerCase();
  };

  private isTransitioningFromThisStep(transition: IWorkflowTransition): boolean {
    return transition.from && transition.from.name.toLowerCase() === this.stepName.toLowerCase();
  };

  // response history assists with tracking response state between workflow steps

  private get responseHistory(): Array<IAppGeneratorResponse> {
    this._responseHistory = this._responseHistory || [];
    return this._responseHistory;
  };

  private set responseHistory(value: Array<IAppGeneratorResponse>) {
    this._responseHistory = value;
  };

  private subscribeToWorkflowTransitions(workflow: IWorkflow) {
    if ( !workflow ) {
      return;
    }
    this.log(`Subscribing to workflow transitions ...`);
    workflow.transitions.subscribe((transition) => {
      this.log({
                 message: `Subscriber responding to an observed '${transition.direction}' workflow transition:
      from ${transition.from ? transition.from.name : 'null'} to ${transition.to ? transition.to.name : 'null'}.`
               });
      if ( this.isTransitioningToThisStep(transition) ) {
        this.forge.begin();
        // .subscribe(response=>{
        //     if (this.responseHistory.length > 0) {
        //       let prevResponse = this.currentResponse;
        //       this.responseHistory.push(prevResponse);
        //       this.log(`Stored fieldset[${prevResponse.payload.length}] into fieldset history ... there are
        // ${this.responseHistory.length} items in history ...`); } this.currentResponse = response; this.fieldSet =
        // response.payload;

        // })
        // switch(transition.direction)
        // {
        //   case WorkflowTransitionDirection.NEXT:{
        //     // arrived at this point in the workflow as the result of a nextStep transition
        //     break;
        //   }
        //   case WorkflowTransitionDirection.PREVIOUS:{
        //     // arrived at this point in the workflow as the result of a previousStep transition
        //     break;
        //   }
        //   case WorkflowTransitionDirection.GO:{
        //     // arrived at this point in the workflow as the result of a goToStep transition
        //     break;
        //   }

        // }
      }
      if ( this.isTransitioningFromThisStep(transition) ) {
        switch ( transition.direction ) {
          case WorkflowTransitionDirection.NEXT: {
            // arrived at this point in the workflow as the result of a nextStep transition
            break;
          }
          case WorkflowTransitionDirection.GO: {
            // arrived at this point in the workflow as the result of a goToStep transition
            break;
          }
          default: {
            break;
          }

        }
      }
    });
  }

  private subscribeToWorkflowTransitions2(workflow: IWorkflow) {
    if ( !workflow ) {
      return;
    }
    this.log(`Subscribing to workflow transitions ...`);
    workflow.transitions.subscribe((transition) => {
      try {
        this.log({
                   message: `Subscriber responding to an observed '${transition.direction}' workflow transition:
        from ${transition.from ? transition.from.name : 'null'} to ${transition.to ? transition.to.name : 'null'}.`
                 });
        // entering this step
        if ( this.isTransitioningToThisStep(transition) ) {
          switch ( transition.direction ) {
            case WorkflowTransitionDirection.NEXT: {
              if ( transition.from !== transition.to ) {
                let request: IAppGeneratorRequest = {
                  command: {
                    name: `${this.commandName}`,
                    parameters: {
                      inputs: null,
                      data: null,
                      workflow: {
                        step: {
                          name: 'begin'
                        }
                      }
                    }
                  }
                };
                this.log('command being sent to the app generator service:');
                this._appGeneratorService.getFieldSet(request)
                .subscribe((response) => {

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
              break;
            }
            case WorkflowTransitionDirection.PREVIOUS: {
              if ( transition.from === transition.to ) {
                let response = this.responseHistory.pop();
                this.fieldSet = response.payload.data;
                this.log(`Restored fieldset[${response.payload.data.length}] from fieldset history
                ... there are ${this.responseHistory.length} items in history ...`);
              }
              break;
            }
            default: {
              break;
            }
          }
        }
        // leaving the step
        if ( this.isTransitioningFromThisStep(transition) ) {
          switch ( transition.direction ) {
            case WorkflowTransitionDirection.NEXT: {
              if ( transition.from !== transition.to ) {
                // keep at this point
                transition.to = transition.from;
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
              }
              // transition.canContinue = false to prevent transitions;
              break;
            }
            default: {
              break;
            }
          }
        }
      } catch (err) {
        this.log({ message: err.message, error: true, inner: err });
      }
    });
  }

  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => {};

}

