import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'


@Injectable()
export class PaymentService {

    constructor(private http: HttpClient) { }

    public getPendingPayments(): Observable<any> {
        return this.http.get('/api/v1/payments')
    }

    public getPaidPayments(): Observable<any> {
        return this.http.get('/api/v1/payments/paid')
    }

    public acceptPayment(payment): Observable<any> {
        return this.http.post('/api/v1/payments/accept', payment)
    }

    public declinePayment(payment): Observable<any> {
        return this.http.post('/api/v1/payments/decline', payment)
    }

}