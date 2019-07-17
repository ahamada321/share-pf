import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http'
import { Review } from './service/review.model';
import { ReviewService } from './service/review.service';
import { SwalPartialTargets } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  review: Review = new Review()
  modalRef: any
  @Input() bookingId: string
  @Output() reviewSubmitted = new EventEmitter()
  errors: any[]

  constructor(private modalService: NgbModal,
              private reviewService: ReviewService,
              public readonly swalTargets: SwalPartialTargets ) { }

  ngOnInit() {
  }

  openReviewModal(content) {
    this.modalRef = this.modalService.open(content)
  }

  confirmReview() {
    this.reviewService.createReview(this.review, this.bookingId).subscribe(
      (review: Review) => {
        this.modalRef.close()
        this.reviewSubmitted.emit(review)
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors
      }
    )
  }
}
