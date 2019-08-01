import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs';
import { CamelizePipe } from 'ngx-pipes'


@Injectable()
export class GoogleMapsService {
    private geoCoder
    private locationCache: any = {}

    constructor(private camelizePipe: CamelizePipe) { }

    private camelize(value: string): string {
        return this.camelizePipe.transform(value)
    }

    private cacheLocation(location: string, coodinates: any) {
        this.locationCache[this.camelize(location)] = coodinates
    }

    private isLocationCached(location): boolean {
        return this.locationCache[this.camelize(location)]
    }

    private geocodeLocation(location: string): Observable<any> {
        this.geoCoder = new (<any>window).google.maps.Geocoder()
        if(!this.geoCoder) { this.geoCoder = new (<any>window).google.maps.Geocoder() }

        return new Observable((observer) => {
            this.geoCoder.geocode({address: location}, (result, status) => {
                if(status === 'OK') {
                    const geometry = result[0].geometry.location
                    const coodinates = {lat: geometry.lat(), lng: geometry.lng()}

                    this.cacheLocation(location, coodinates) // Cahing location info.
                    observer.next(coodinates)
                } else {
                    observer.error('Location could not be geocoded')
                }
            })
        })
    }

    public getGeoLocation(location: string): Observable<any> {
        if(this.isLocationCached(location)) {
            return of(this.locationCache[this.camelize(location)])
        } else {
            return this.geocodeLocation(location)
        }
    }
}