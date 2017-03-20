import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, SimpleChange, Input,Output, Inject,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { IWorkflowStep, IWorkflowTransition, IWorkflow, WorkflowTransitionDirection } from '../models/workflow';
import { getLogger, ILoggerDelegate } from '../common/logger';
import { INotifyPropertyChanged } from '../core/component'

import { IFieldInfo, IFieldSet, IAppGeneratorService, IAppGeneratorServiceProvider } from '../services/app-generator.service';
import { IForgeServiceProvider } from '../services/forge.service'

@Component({
  host: {
    'class': 'wizard-step'
  },
  selector: 'wizard-dynamic-step',
  templateUrl: './wizard-dynamic-step.component.html',
  styleUrls: ['./wizard-dynamic-step.component.scss'],
  providers:[IAppGeneratorServiceProvider.MockFactoryProvider,IForgeServiceProvider.MockFactoryProvider]
})
export class WizardDynamicStepComponent implements OnInit, OnDestroy, OnChanges {

  // keep track of the number of instances
  static instanceCount: number = 0;
  /** logger delegate delegates logging to a logger */
  private log: ILoggerDelegate = () => { };

  private _workflow: IWorkflow
  @Input()
  get workflow(): IWorkflow {
    return this._workflow
  }
  set workflow(value: IWorkflow) {
    this._workflow = value;
  }



  @Input() stepName: string = "";

  constructor( @Inject(IAppGeneratorServiceProvider.InjectToken) private _fieldSetService: IAppGeneratorService) {
    this.log = getLogger(this.constructor.name,WizardDynamicStepComponent.instanceCount++);
    this.log(`New instance ...`);

  }

  /** All inputs are bound and values assigned, but the 'workflow' get a new instance every time the parents host dialog is opened */
  ngOnInit() {
    this.log(`ngOnInit ...`)
    //this.subscribeToWorkflowTransitions(this.workflow);
  }

  ngOnDestroy() {
    this.log(`ngOnDestory ...`)
  }
  /** handle all changes to @Input properties */
  ngOnChanges(changes: SimpleChanges) {
    this.log(`ngOnChanges ...`)
    for (let propName in changes) {
      switch (propName.toLowerCase()) {
        case "workflow":
          {
            let change: INotifyPropertyChanged<IWorkflow> = <any>changes[propName];
            this.onWorkflowPropertyChanged(change);
            break;
          }
      }
    }
  }
  // @Output() onStepComplete = new EventEmitter();
  // StepComplete(event: Event,...arg:string[]) {
  //   this.log("dynamic step custom submit");
  //   //event.stopPropagation();
  //   this.onStepComplete.next();
  // }

  private onWorkflowPropertyChanged(change?: INotifyPropertyChanged<IWorkflow>) {
    if (change) {
      if (change.currentValue !== change.previousValue) {
        this.log(`The workflow property changed value ...`);
        let prev: IWorkflow = change.previousValue;
        let current: IWorkflow = change.currentValue;
        this.subscribeToWorkflowTransitions(current);
      }
    }
  }

  private isTransitioningToThisStep(transition: IWorkflowTransition): boolean {
    return transition.to && transition.to.name.toLowerCase() === this.stepName.toLowerCase()
  }
  private isTransitioningFromThisStep(transition: IWorkflowTransition): boolean {
    return transition.from && transition.from.name.toLowerCase() === this.stepName.toLowerCase()
  }

  private _fieldSet: IFieldSet;
  get fieldSet(): IFieldSet {
    this._fieldSet = this._fieldSet || [];
    return this._fieldSet;
  }
  set fieldSet(value: IFieldSet) {
    this._fieldSet = value;
  }

  private _fieldSetHistory: Array<IFieldSet>;
  get fieldSetHistory(): Array<IFieldSet> {
    this._fieldSetHistory = this._fieldSetHistory || [];
    return this._fieldSetHistory;
  }
  set fieldSetHistory(value: Array<IFieldSet>) {
    this._fieldSetHistory = value;
  }

  private subscribeToWorkflowTransitions(workflow: IWorkflow) {
    if (!workflow) {
      return;
    }
    this.log(`Subscribing to workflow transitions ...`);
    workflow.transitions.subscribe((transition) => {
      try {
        this.log({ message: `Subscriber responding to an observed '${transition.direction}' workflow transition: from ${transition.from ? transition.from.name : "null"} to ${transition.to ? transition.to.name : "null"}.` });
        if (this.isTransitioningToThisStep(transition)) {
          switch (transition.direction) {
            case WorkflowTransitionDirection.NEXT:
              {
                if (transition.from != transition.to) {
                  //handle first fieldset
                  this._fieldSetService.getFieldSet({ command: "first" }).subscribe((fieldSet) => {
                    let prevFieldSet = this.fieldSet;
                    if (this.fieldSetHistory.length > 0) {
                      this.fieldSetHistory.push(prevFieldSet);
                    }
                    this.fieldSet = fieldSet
                    this.log(`Stored fieldset[${prevFieldSet.length}] into fieldset history ... there are ${this.fieldSetHistory.length} items in history ...`);
                  })
                }
                break;
              }
            case WorkflowTransitionDirection.PREVIOUS:
              {
                if (transition.from === transition.to) {
                  let fieldSet = this.fieldSetHistory.pop();
                  this.fieldSet = fieldSet;
                  this.log(`Restored fieldset[${fieldSet.length}] from fieldset history ... there are ${this.fieldSetHistory.length} items in history ...`);
                }
                break;
              }
          }
        }
        //leaving the step
        if (this.isTransitioningFromThisStep(transition)) {
          switch (transition.direction) {
            case WorkflowTransitionDirection.NEXT:
              {
                if (transition.from != transition.to) {
                  //handle first fieldset
                  this._fieldSetService.getFieldSet({ command: "second" }).subscribe((fieldSet) => {
                    let prevFieldSet = this.fieldSet;
                    this.fieldSetHistory.push(prevFieldSet);
                    this.fieldSet = fieldSet
                    this.log(`stored fieldset[${prevFieldSet.length}] into history ... there are ${this.fieldSetHistory.length} items in history ...`);
                  })
                  //keep at this point
                  transition.to = transition.from;
                }
                // transition.continue = false to prevent transitions;
                break;
              }
          }
        }
      }
      catch (err) {
        this.log({ message: err.message, error: true, inner: err });
      }
    })
  }
}
