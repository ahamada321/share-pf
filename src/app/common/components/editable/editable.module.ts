import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { EditableInputComponent } from './editable-input/editable-input.component';
import { EditableSelectComponent } from './editable-select/editable-select.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component'





@NgModule({
    declarations: [
        EditableInputComponent,
        EditableSelectComponent,
        EditableTextareaComponent
      ],
      imports: [
          CommonModule,
          FormsModule
        ],
      exports: [
        EditableInputComponent,
        EditableSelectComponent,
        EditableTextareaComponent
      ],
      providers: [
          //EditableService
        ],
      bootstrap: []
})
export class EditableModule { }