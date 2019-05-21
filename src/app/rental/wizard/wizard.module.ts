import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WizardComponent } from './wizard.component';
import { MaterialModule } from 'src/app/common/modules/matmodule/matmodule';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    WizardComponent
  ],
  declarations: [
      WizardComponent
  ]
})

export class WizardModule {}
