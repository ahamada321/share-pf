import { Component, OnInit } from '@angular/core';

class FileSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  selectedFile: FileSnippet

  constructor() { }

  ngOnInit() {
  }

  processFile(imageInput: any) {
    debugger
    const file: File = imageInput.files[0]
    const reader = new FileReader()

    
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSnippet(event.target.result, file)
    })
    reader.readAsDataURL(file)
  }
}
