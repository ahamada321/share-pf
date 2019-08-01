import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { GoogleMapsService } from './service/googlemaps.service';
import { PlaceService } from './service/place.service';
import { Place } from './service/place.model';


@Component({
    selector: 'app-googlemaps',
    templateUrl: './googlemaps.component.html'
})

export class GoogleMapsComponent {
    @Input() location: string
    places: Place[]

    previous_info_window = null
    isPositionError: boolean = false
    lat: number
    lng: number
    styles: any[] = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

    constructor(private googlemapService: GoogleMapsService,
                private placeService: PlaceService,
                private ref:ChangeDetectorRef ) { }

    mapReadyHandler() {
        this.initLocation()
    }

    private initLocation() {
        this.googlemapService.getGeoLocation(this.location).subscribe(
            (coodinates) => {
                this.lat = coodinates.lat
                this.lng = coodinates.lng
                this.places = [{
                    lat: this.lat +0.001,
                    lng: this.lng +0.001,
                    placeName: 'アイウエオスタジオ',
                    tel: '03-1234-1234',
                    address: '東京都新宿区歌舞伎町1-1-1',
                    nearStation: '新宿駅'
                },
                {
                    lat: 35.6988495,
                    lng: 139.7055201,
                    placeName: 'かきくけこスタジオ',
                    tel: '03-1234-1234',
                    address: '東京都新宿区歌舞伎町3-3-3',
                    nearStation: '新宿駅'
                }]
                // this.getPlaces()

                this.ref.detectChanges()
            },
            (error) => {
                this.isPositionError = true
            }
        )
    }

    private getPlaces() {
        this.placeService.getPlacesFrom(this.location).subscribe(
            (places/*: Place[]*/) => {
                this.locatePlaces(places)
                this.ref.detectChanges()
            },
            (err) => {

            }
        )
    }

    private locatePlaces(places) {
        // if(places && places.length>0) {
        //     for(let place of places) {
        //         this.googlemapService.getGeoLocation(place.address).subscribe(
        //             (coodinates) => {
        //                 place.lat = coodinates.lat
        //                 place.lng = coodinates.lng
        //                 this.ref.detectChanges()
        //             },
        //             (error) => {
        //                 this.isPositionError = true
        //             }
        //         )
        //     }
        // }
    }

    onMarkerClick(infoWindow) {
        if (this.previous_info_window) {
            this.previous_info_window.close()
        }
        this.previous_info_window = infoWindow
    }
}
