import { Product } from 'src/app/modules/admin/components/upload/upload.component';
import { Component } from '@angular/core';
import { DataService } from 'src/app/data.service';
import {
  faBagShopping,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.css'],
})
export class BeerComponent {
  beer: Product[] = [];
  addIcon = faPlus;
  minusIcon = faMinus;
  cartList: Product[] = [];

  constructor(private data: DataService<Product>) {}
  ngOnInit() {
    this.data.getProducts('products', 'corporate-boxes').then((beer) => {
      beer?.subscribe((item) => {
        this.beer = item;
      });
    });
  }

  increment(index: number) {
    this.beer[index].quantity++;
  }

  decrement(index: number) {
    if (this.beer[index].quantity > 0) {
      this.beer[index].quantity--;
    }
  }

  getTotal(index: number) {
    this.beer[index].total =
      Number(this.beer[index].quantity) * Number(this.beer[index].price);
  }

  order(index: number) {
    let order: Product = {
      productName: this.beer[index].productName,
      total: this.beer[index].total,
      quantity: this.beer[index].quantity,
      availability: this.beer[index].availability,
      ingredients: this.beer[index].ingredients,
      category: 'beer',
      price: this.beer[index].price,
      success: false,
    };
    this.data.sendData(order);
    this.beer[index].success = true;
    // this.data.updateBadgeNumber();
    // localStorage.setItem('cart', JSON.stringify(order));
  }

  resetFields(product: Product) {
    product.quantity = 0;
    product.total = 0;
    setTimeout(() => {
      product.success = false;
    }, 2000);
  }
}
