import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { CamelizePipe } from 'ngx-pipes'
import { GoogleMapsComponent } from './googlemaps.component';
import { GoogleMapsService } from './service/googlemaps.service';
import { PlaceService } from './service/place.service';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    GoogleMapsComponent
],
  imports: [
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAPS_API_PUBLISH_KEY
    })
  ], 
  exports: [GoogleMapsComponent],
  providers: [
    GoogleMapsService,
    PlaceService,
    CamelizePipe
  ],
  bootstrap: [],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class GoogleMapsModule {}
