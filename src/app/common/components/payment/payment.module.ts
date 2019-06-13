import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { PaymentComponent } from './payment.component';
import { PaymentService } from './services/payment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        PaymentComponent
      ],
      imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
        ],
      exports: [PaymentComponent],
      providers: [
          PaymentService
        ],
      bootstrap: []
})
export class PaymentModule { }