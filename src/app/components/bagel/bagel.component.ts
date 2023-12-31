import { Product } from 'src/app/modules/admin/components/upload/upload.component';
import { DataService } from 'src/app/data.service';
import { Component, OnInit } from '@angular/core';
import {
  faBagShopping,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bagel',
  templateUrl: './bagel.component.html',
  styleUrls: ['./bagel.component.css'],
})
export class BagelComponent {
  bagel: Product[] = [];
  addIcon = faPlus;
  minusIcon = faMinus;
  cartList: Product[] = [];
  constructor(private data: DataService<Product>) {}
  ngOnInit() {
    this.data
      .getProducts('products', 'sandwiches-wraps-buns-bagels')
      .then((bagel) => {
        bagel?.subscribe((item) => {
          this.bagel = item;
        });
      });
  }

  increment(index: number) {
    this.bagel[index].quantity++;
  }

  decrement(index: number) {
    if (this.bagel[index].quantity > 0) {
      this.bagel[index].quantity--;
    }
  }

  getTotal(index: number) {
    this.bagel[index].total =
      Number(this.bagel[index].quantity) * Number(this.bagel[index].price);
  }

  order(index: number) {
    let order: Product = {
      productName: this.bagel[index].productName,
      total: this.bagel[index].total,
      quantity: this.bagel[index].quantity,
      availability: this.bagel[index].availability,
      ingredients: this.bagel[index].ingredients,
      category: 'bagel',
      price: this.bagel[index].price,
      success: false,
    };
    this.data.sendData(order);
    this.bagel[index].success = true;
  }

  resetFields(product: Product) {
    product.quantity = 0;
    product.total = 0;
    setTimeout(() => {
      product.success = false;
    }, 2000);
  }
}
