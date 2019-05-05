import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


export class EditableComponent implements OnInit {

  @Input() entity: any
  @Input() set field(entityField: string) {
    this.entityField = entityField
    this.memoryOriginValue()
  }
  @Input() className: string
  @Input() style: any
  @Input() type: string = "text"
  @Output() entityUpdated = new EventEmitter()

  isActiveInput: boolean = false
  originEntitiyValue: any
  entityField: string


  constructor() { }

  ngOnInit() {
  }

  updateEntity() {
    const entityValue = this.entity[this.entityField]
    if(entityValue != this.originEntitiyValue) {
      // {[this.field]: entityValue}
      // Data comes like {'rentalname': 'ゆうこ' }
      this.entityUpdated.emit({[this.entityField]: entityValue})
      this.memoryOriginValue
    }

    this.isActiveInput = false
  }

  memoryOriginValue() {
    this.originEntitiyValue = this.entity[this.entityField]
  }

  canselUpdate() {
    this.entity[this.entityField] = this.originEntitiyValue
    this.isActiveInput = false
  }

}
