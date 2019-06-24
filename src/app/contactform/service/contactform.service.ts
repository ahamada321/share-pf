import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Contactform } from './contactform.model'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class ContactformService {

    constructor(private http: HttpClient) { }

    public sendFormMsg(formData: Contactform): Observable<any> {
        return this.http.post('/api/v1/contactforms', formData)
    }
  
}