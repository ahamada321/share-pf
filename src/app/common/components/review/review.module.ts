import { NgModule } from '@angular/core';
import { BarRatingModule } from "ngx-bar-rating";

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewComponent } from './review.component';
import { ReviewService } from './service/review.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
    declarations: [
        ReviewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BarRatingModule,
        SweetAlert2Module
    ],
    exports: [ReviewComponent],
    providers: [
        ReviewService
    ],
    bootstrap: []
})
export class ReviewModule { }