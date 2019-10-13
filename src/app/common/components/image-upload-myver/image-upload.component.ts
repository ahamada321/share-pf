import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

class FileSnippet {
  static readonly IMAGE_SIZE = { width:480, height:480 }
  pending: boolean = false
  status: string = 'INIT'

  constructor(public src: string, public file: Blob) { }
}

@Component({
  selector: 'app-image-upload-myver',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadMyverComponent implements OnInit {
  @Input() inputImage
  @Output() imageUploaded = new EventEmitter()
  @Output() imageError = new EventEmitter()

  selectedFile: FileSnippet
  imageChangedEvent: any = ''

  constructor(private imageService: ImageUploadService) { }

  ngOnInit() {
    if(this.inputImage) {
      this.selectedFile = new FileSnippet(this.inputImage, null)
    }
  }

  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false
    this.selectedFile.status = 'OK'
    this.imageChangedEvent = null
    this.imageUploaded.emit(imageUrl)

  }
  private onFailure() {
    this.selectedFile.pending = false
    this.selectedFile.status = 'FAIL'
    this.imageChangedEvent = null
    this.imageError.emit('')
  }

  fileChangeEvent(event: any) {
    this.selectedFile = new FileSnippet('', event.file)

    const URL = window.URL
    let file, img
    if((file = event.target.files[0])  && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      img = new Image()

      const self = this
      img.onload = function() {
        if((this.width > FileSnippet.IMAGE_SIZE.width) && (this.height > FileSnippet.IMAGE_SIZE.height)) {
          self.imageChangedEvent = event
        } else {
          // handle error
          self.imageChangedEvent = event // Tempolaly arrowed every size.
        }
      }
      img.src = URL.createObjectURL(file)
    } else {
      // handle error
      this.selectedFile.status = 'FAIL'
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.selectedFile.file = event.file
  }

  uploadImage() {
    if(this.selectedFile) {
      this.selectedFile.status = 'PENDING'
      const reader = new FileReader()
      reader.readAsDataURL(this.selectedFile.file)
      reader.addEventListener('load', (event: any) => {
        this.selectedFile.src = event.target.result
        this.selectedFile.pending = true
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSuccess(imageUrl)
          },
          () => {
            this.onFailure()
          }
        )

      })
    }
  }

}
