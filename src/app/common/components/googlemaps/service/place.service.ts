import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Place } from './place.model'
import { HttpClient } from '@angular/common/http'

@Injectable()
export class PlaceService {

    constructor(private http: HttpClient) { }

    public getPlacesFrom(location: string): Observable<any> {
        return this.http.get('/api/v1/places/' + location)
    }
    
    // public getRentals(): Observable<any> {
    //     return this.http.get('/api/v1/rentals')
    // }

    // public getOwnerRentals(): Observable<any> {
    //     return this.http.get('/api/v1/rentals/manage')
    // }

    // public createRental(rentalData: Rental): Observable<any> {
    //     return this.http.post('/api/v1/rentals', rentalData)
    // }

    // public deleteRental(rentalId: string): Observable<any> {
    //     return this.http.delete('/api/v1/rentals/' + rentalId)
    // }

    // public updateRental(rentalId: string, rentalData: Rental): Observable<any> {
    //     return this.http.patch('/api/v1/rentals/' + rentalId, rentalData)
    // }
}