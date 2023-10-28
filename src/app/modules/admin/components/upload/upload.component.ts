import { CoffeeOrder } from './../../../../components/coffee/coffee.component';
import { DataService } from './../../../../data.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Order } from 'src/app/components/croissant/croissant.component';

export interface Product extends Order {
  productName: string;
  category: string;
  price: number;
  availability: boolean;
  ingredients: string;
}
export interface Coffee {
  productName: string;
  price: {
    small: number;
    medium: number;
    large: number;
  };
  extra: {
    soy: number;
    coconut: number;
    oat: number;
    extraShot: number;
    lactoseFree: number;
  };
  availability: boolean;
  category: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  constructor(private afs: DataService<Product>) {}

  // async onFileChange(event: any) {
  //   const file = event.target.files[0]
  //   if(file) {
  //     const path = `gg/${file.name}`
  //     const uploadTask = await this.firestroage.upload(path, file)
  //     const url = await uploadTask.ref.getDownloadURL()
  //     console.log(url)
  //   }
  // }

  category = [
    'coffee',
    'Corporate-Boxes',
    'Boardroom-Triangular-Sandwiches',
    'Sandwiches-Wraps-buns-bagels',
    'Drinks',
    'Granola-yoghurt-fruit',
    'Salads',
  ];

  _productName: string = '';
  _category: string = '';
  _price: number = 0;
  _availability: boolean = true;
  _ingredients: string = '';

  isCoffee = false;
  isSuccess = false;
  hasError = false;

  upload(reset: NgForm) {
    if (confirm('Confim to upload product!')) {
      let product: Product = {
        productName: this._productName,
        category: this._category.toLowerCase(),
        price: this._price,
        availability: this._availability,
        ingredients: this._ingredients,
        total: 0,
        quantity: 0,
        success: false,
      };
      this.afs.addProduct(product);
      reset.reset();
    }
  }

  uploadCoffee(reset: NgForm) {
    let coffee: Coffee = {
      productName: this._productName,
      availability: this._availability,
      price: {
        small: 4.5,
        medium: 5.5,
        large: 6.0,
      },
      extra: {
        soy: 1,
        coconut: 1,
        oat: 1,
        extraShot: 0.5,
        lactoseFree: 1,
      },
      category: this._category.toLowerCase(),
    };
    this.afs.addCoffee(coffee);
    reset.reset();
  }
}
