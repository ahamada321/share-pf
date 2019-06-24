import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from './contactform.component';
import { ContactformService } from './service/contactform.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    declarations: [ ContactFormComponent ],
    exports:[ ContactFormComponent ],
    providers: [ ContactformService ]
})
export class ContactformModule { }
