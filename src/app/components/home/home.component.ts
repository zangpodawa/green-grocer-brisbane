import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/modules/admin/components/upload/upload.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private auth: AuthService) {}

  ngOnInit() {}
}
