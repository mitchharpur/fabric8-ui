import { Context } from './../models/context';
import { ContextService } from './../shared/context.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { SpaceService, Space, ProcessTemplate, SpaceAttributes } from 'ngx-fabric8-wit';
import { Broadcaster, User } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';

import { IModalHost } from './models/modal-host';

import {WorkflowFactory, IWorkflow, IWorkflowStep } from './models/workflow';

import { SpaceConfigurator } from './models/codebase';
import { getLogger, ILoggerDelegate } from './models/logger';

@Component({
  host: {
    'class': 'wizard-container'
  },
  selector: 'space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss'],
  providers: [SpaceService]

})
export class SpaceWizardComponent implements OnInit {

  static instanceCount: number = 0;

  @Input() host: IModalHost;
  /** adds a log entry to the logger */
  log: ILoggerDelegate = () => { };

  configurator: SpaceConfigurator;

  private _context: Context;

  private _workflow: IWorkflow = null;
  @Input()
  get workflow(): IWorkflow {
    if (!this._workflow) {
      this.log(`resolving workflow instance`);
      this._workflow = WorkflowFactory.Create();
    }
    return this._workflow;
  };

  set workflow(value: IWorkflow) {
    this._workflow = value;
  }

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private _contextService: ContextService) {
    this.log = getLogger(this.constructor.name,SpaceWizardComponent.instanceCount++);
    this.log(`New instance ...`);
  }

  ngOnInit() {
    this.log(`ngInit ...`)
    this.configureComponentHost();
    this.configurator = this.createSpaceConfigurator();
    this._contextService.current.subscribe(val => this._context = val);
  }

  /** configure component host dialog settings */
  configureComponentHost() {

    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;

    let me = this;
    // Intercept when the host dialog is opened or closed to perform initialization and settings adjustments
    let originalOpenHandler = this.host.open;
    this.host.open = function (...args) {
      me.log(`Opening wizard modal dialog ...`);
      me.reset();
      //note: 'this' is not me ... but an instance of Modal that is why  => is not being used here
      return originalOpenHandler.apply(this, args);
    }
    let originalCloseHandler = this.host.close;
    this.host.close = function (...args) {
      me.log(`Closing wizard modal dialog ...`);
      //note: 'this' is not me ... but an instance of Modal that is why  => is not being used here
      return originalCloseHandler.apply(this, args);
    }
  }
  /** creates and initializes a default space */
  createSpace(): Space {
    let space = {} as Space;
    space.name = '';
    space.path = '';
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.privateSpace = false;
    space.process = this.dummy.processTemplates[0];
    return space;
  }
  /** creates and initializes the default space configurator */
  createSpaceConfigurator(): SpaceConfigurator {
    let configurator = new SpaceConfigurator();
    configurator.space = this.createSpace();
    return configurator;
  }
  /** create and initializes a new workflow object */
  createAndInitializeWorkflow(): IWorkflow {
    let component=this;
    let  workflow = WorkflowFactory.Create({
        steps: () => {
          return [
            { name: "space", index: 0, nextIndex: 1 },
            { name: "forge", index: 6, nextIndex: 0 },
            { name: "quickStart", index: 2, nextIndex: 3 },
            { name: "stack", index: 3, nextIndex: 4 },
            { name: "pipeline", index: 4, nextIndex: 4 },
            { name: "dynamic-step", index: 5, nextIndex: 6 }
          ];
        },
        firstStep: () => {
          return {
            index: 0
          };
        },
        cancel: (...args) => {
          // ensure cancel has correct 'this'
          component.cancel.apply(component, args);
        },
        finish: (...args) => {
          // ensure finish has correct 'this'
          component.finish.apply(component, args);
        },
      })
    return workflow;
  }
  reset() {
    this.log(`Reset ...`);
    this.configurator = this.createSpaceConfigurator();
    this.workflow = this.createAndInitializeWorkflow();
  }

  finish() {
    this.log(`Finish ...`);
    console.log('finish!', this._context);
    let space = this.configurator.space;
    space.attributes.name = space.name;
    console.log(this._context);
    if (this._context && this._context.entity) {
      // TODO Implement space name validation
      // Support organisations as well
      space.path =
        (this._context.entity as User).attributes.username + '/' + this.convertNameToPath(space.name);
    } else if (this._context) {
      space.path = this.dummy.currentUser + '/' + this.convertNameToPath(space.name);
    }

    this.spaceService.create(space)
      .subscribe(
      (createdSpace) => {
        this.dummy.spaces.push(space);
        this.broadcaster.broadcast('save', 1);
        if (space.path) {
          this.router.navigate([space.path]);
        }
        this.reset();
      },
      (err) => {
        // TODO:consistent error handling on failures
        let errMessage = `Failed to create the collaboration space:
            space name :
            ${space.name}
            message:
            ${err.message}
            `;
        alert(errMessage);
      });
  }

  cancel() {
    this.log(`Cancel...`);
    if (this.host) {
      this.host.close();
    }
  }

  private convertNameToPath(name: string) {
    // convert to ASCII etc.
    return name.replace(' ', '-').toLowerCase();
  }

}
