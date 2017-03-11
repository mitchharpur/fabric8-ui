import { Context } from './../models/context';
import { ContextService } from './../shared/context.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SpaceService, Space, ProcessTemplate, SpaceAttributes } from 'ngx-fabric8-wit';
import { Broadcaster, User } from 'ngx-login-client';

import { DummyService } from '../shared/dummy.service';

import { IModalHost } from './domain/modal-host';
import { IWizardStep, IWizard } from './domain/wizard';
import { Wizard } from './domain/wizard-implementation';

import { SpaceConfigurator } from './domain/codebase';

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

  configurator: SpaceConfigurator;
  private _context: Context;
  wizard: IWizard;

  @Input() host: IModalHost;


  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private _contextService: ContextService) {
    SpaceWizardComponent.instanceCount++;
    console.log(`space-wizard: ${SpaceWizardComponent.instanceCount} : creating instance`);
  }

  ngOnInit() {
    console.log(`space-wizard: ${SpaceWizardComponent.instanceCount} : ngOnInit`)
    this.configureHost();
    this.wizard = this.createWizard();
    this.configurator=this.createSpaceConfigurator();
    this._contextService.current.subscribe(val => this._context = val);
  }

  /** configure host dialog settings */
  configureHost() {
    this.host.closeOnEscape = true;
    this.host.closeOnOutsideClick = false;
    let me = this;
    // apply reset every time the host dialog is opened
    let openHandler = this.host.open;
    this.host.open = function (...args) {
      console.log(`space-wizard: ${SpaceWizardComponent.instanceCount} : Opening wizard modal dialog ...`);
      me.reset();
      return openHandler.apply(this, args);
    }
    let closeHandler = this.host.close;
    this.host.close = function (...args) {
      console.log(`space-wizard: ${SpaceWizardComponent.instanceCount} : Closing wizard modal dialog ...`);
       return closeHandler.apply(this, args);
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
  /** create and initializes the wizard */
  createWizard():IWizard
  {
    return new Wizard();
  }
  initWizard(wizard?:IWizard): IWizard {
    if(!wizard)
    {
      wizard=this.createWizard()
    }
    wizard.initialize({
      steps: () => {
        return [
          { name: "space", index: 0, nextIndex: 1 },
          { name: "forge", index: 1, nextIndex: 2 },
          { name: "quickStart", index: 2, nextIndex: 3 },
          { name: "stack", index: 3, nextIndex: 4 },
          { name: "pipeline", index: 4, nextIndex: 4 }
        ];
      },
      firstStep: () => {
        return {
          index: 0
        };
      }
    });
    return wizard;
  }
  reset() {
    console.info(`space-wizard: ${SpaceWizardComponent.instanceCount} : reset`);
    this.configurator=this.createSpaceConfigurator();
    this.wizard=this.createWizard()
    this.wizard=this.initWizard()
  }

  finish() {
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
    if (this.host) {
      this.host.close();
    }
  }

  private convertNameToPath(name: string) {
    // convert to ASCII etc.
    return name.replace(' ', '-').toLowerCase();
  }

}
