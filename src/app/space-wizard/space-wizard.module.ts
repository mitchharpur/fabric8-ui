import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {runtimeConsoleImports} from './../shared/runtime-console/runtime-console';
import {UniqueSpaceNameValidatorDirective, ValidSpaceNameValidatorDirective} from "ngx-fabric8-wit";
import { AuthenticationService } from 'ngx-login-client';

import {IForgeServiceProvider} from './services/forge.service';
import {IWorkflowProvider } from './models/workflow'
import {ForgeCommandComponent} from './components/forge-command/forge-command.component';
import {LoggerFactory} from './common/logger';
import {SpaceWizardComponent} from './space-wizard.component';
import {WorkflowFactory} from './models/workflow';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SpaceWizardComponent,
    ForgeCommandComponent,
    UniqueSpaceNameValidatorDirective,
    ValidSpaceNameValidatorDirective
  ],
  exports: [
     SpaceWizardComponent,
     UniqueSpaceNameValidatorDirective
  ],
  providers:[
    IForgeServiceProvider.FactoryProvider,
    LoggerFactory,
    WorkflowFactory,
    AuthenticationService
  ]
})
export class SpaceWizardModule {

};
