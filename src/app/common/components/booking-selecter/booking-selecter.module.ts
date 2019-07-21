import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BookingSelecterComponent } from './booking-selecter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
    declarations: [
        BookingSelecterComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [BookingSelecterComponent],
    providers: [],
    bootstrap: []
})
export class BookingSelecterModule { }