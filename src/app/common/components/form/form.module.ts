import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from '../../../form/contactform/contactform.component';
import { ContactformService } from './service/contactform.service';
import { TrialFormComponent } from '../../../form/trialform/trialform.component';
import { FormComponent } from './form.component';


@NgModule({
    declarations: [ 
        FormComponent, 
        ContactFormComponent, 
        TrialFormComponent 
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    exports:[ ContactFormComponent, TrialFormComponent ],
    providers: [ ContactformService ]
})
export class ContactformModule { }
