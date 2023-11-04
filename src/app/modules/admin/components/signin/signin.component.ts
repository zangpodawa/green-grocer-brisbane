// import { Roles, User } from './../../auth.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

export interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
}

export interface Claims {
  token: '';
}

export interface Roles {
  uid: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  invalid = false;
  signedIn = false;
  spinner = false;
  userUid = '';

  admin: Observable<User> | undefined;
  user = this.fb.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required],
  });

  // admin: Observable<User> | undefined;
  // roles: Observable<Roles> | undefined;
  adminError: boolean | undefined;

  getUid(user: Observable<User>) {
    user.subscribe((data) => {
      if (data.uid) {
        this.userUid = data.uid;
        console.log(this.userUid);
      }
    });
  }

  async signIn() {
    this.invalid = false;
    this.spinner = true;
    let email = this.user.controls['email'].value;
    let password = this.user.controls['password'].value;
    if (email && password) {
      await this.auth
        .signIn(email, password)
        .then((user) => {
          this.signedIn = true;
          this.spinner = false;
          this.admin = this.auth.admin$;
          if (this.admin) {
            this.getUid(this.admin);
          }
          this.auth.login(this.userUid).subscribe(async (data) => {
            console.log(data.token);

            await this.auth.tokenSignIn(data.token);
            this.isAdmin();
            this.router.navigate(['myadmin']);
          });
        })
        .catch((error) => {
          this.invalid = true;
          this.spinner = false;
        });
    }
    this.user.reset();
  }

  signOut() {
    this.signedIn = false;
    this.auth.signOut();
  }

  get() {
    // this.auth.getFromServer().subscribe((data) => {
    //   console.log(`data from my node ${data}`);
    // });
  }

  isAdmin() {
    let role = localStorage.getItem('roles');
    let admin: Roles | undefined;
    if (role) {
      admin = JSON.parse(role);
      this.adminError = !admin?.isAdmin;
    }
    setTimeout(() => {
      this.adminError = false;
    }, 3000);
  }

  googleSignin() {
    // this.auth.googleSignIn();
  }
}
