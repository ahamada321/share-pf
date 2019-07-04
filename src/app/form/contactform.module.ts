import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from './contactform/contactform.component';
import { ContactformService } from './service/contactform.service';
import { TrialFormComponent } from './trialform/trialform.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    declarations: [ ContactFormComponent, TrialFormComponent ],
    exports:[ ContactFormComponent, TrialFormComponent ],
    providers: [ ContactformService ]
})
export class ContactformModule { }
