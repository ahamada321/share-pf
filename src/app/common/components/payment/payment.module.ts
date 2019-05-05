import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Routes, RouterModule } from '@angular/router'
import { PaymentComponent } from './payment.component';
import { PaymentService } from './services/payment.service';




@NgModule({
    declarations: [
        PaymentComponent
      ],
      imports: [
          CommonModule
        ],
      exports: [PaymentComponent],
      providers: [
          PaymentService
        ],
      bootstrap: []
})
export class PaymentModule { }