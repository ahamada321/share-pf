import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImageUploadMyverComponent } from './image-upload.component';
// import { ImageUploadService } from './image-upload.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageUploadService } from '../image-upload/image-upload.service';

@NgModule({
    declarations: [
        ImageUploadMyverComponent
      ],
    imports: [
        CommonModule,
        ImageCropperModule
    ],
    exports: [
        ImageUploadMyverComponent
    ],
    providers: [
        ImageUploadService
    ],
    bootstrap: []
})
export class ImageUploadMyverModule { }