import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageUploadComponent } from './image-upload.component';
import { ImageUploadService } from './image-upload.service';


@NgModule({
    declarations: [
        ImageUploadComponent
      ],
    imports: [
        CommonModule
    ],
    exports: [
        // ImageUploadComponent
    ],
    providers: [
        ImageUploadService
    ],
    bootstrap: []
})
export class ImageUploadMyModule { }