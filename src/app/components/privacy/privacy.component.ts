import { Component } from '@angular/core';
import { PaymentService } from 'src/app/payment.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent {
  id = '';
  placeholder = false;

  constructor(private dataSale: PaymentService) {}
  ngOnInit() {
    this.dataSale.getID().subscribe((res) => {
      console.log(`privacy ${res}`);
    });
    // this.placeholder = true;
    // this.dataSale.getAllProducts().then((res) => {
    //   res?.subscribe(async (data) => {
    //     const result = await data;
    //     result.forEach((element) => {
    //       if (element.paymentStatus === 'paid') {
    //         this.currentOrder = element;
    //         this.placeholder = false;
    //       }
    //     });
    //   });
    // });
    // console.log(this.currentOrder);
  }
}
