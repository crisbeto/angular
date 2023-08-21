// #docplaster
// #docregion
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Phone, PhoneData } from '../core/phone/phone.service';
import { CheckmarkPipe } from '../core/checkmark/checkmark.pipe';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
    selector: 'phone-detail',
    templateUrl: './phone-detail.template.html',
    standalone: true,
    imports: [NgIf, NgFor, NgClass, CheckmarkPipe]
})
export class PhoneDetailComponent {
  phone: PhoneData;
  mainImageUrl: string;

  constructor(activatedRoute: ActivatedRoute, phone: Phone) {
    phone.get(activatedRoute.snapshot.paramMap.get('phoneId'))
      .subscribe((p: PhoneData) => {
        this.phone = p;
        this.setImage(p.images[0]);
      });
  }

  setImage(imageUrl: string) {
    this.mainImageUrl = imageUrl;
  }
}
