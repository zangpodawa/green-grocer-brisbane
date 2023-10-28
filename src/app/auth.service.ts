import { addDoc, getFirestore } from '@angular/fire/firestore';
import { Product } from 'src/app/modules/admin/components/upload/upload.component';
import { DataService } from 'src/app/data.service';
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, retry, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserModel {
  userId: string;
  firstName: string;
  admin: boolean;
}

export interface Claims {
  token: '';
}

export interface Roles {
  uid: string;
  isAdmin: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface MyAdmin {
  uid: string;
  emial: string;
  role: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData = '';
  userName = '';
  user: UserModel | undefined;
  upperAdmin = false;

  admin$: Observable<User> | undefined;
  curentName: any;
  adminUid: any;
  url = 'http:localhost:8080';

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private data: DataService<Product>,
    private http: HttpClient
  ) {
    let db = getFirestore();
    this.auth.authState.forEach((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          this.userData = token;
          const jwt = this.userData.split('.')[1];
          localStorage.setItem('admin', JSON.stringify(jwt));
          this.user = this.getUser(token) as UserModel;
        });
      }
    });
  }

  getUser(token: string): UserModel {
    const payLoad = JSON.parse(window.atob(token.split('.')[1]));
    const user: UserModel = {
      userId: payLoad.user_id,
      firstName: payLoad.name,
      admin: payLoad.admin,
    };
    return user;
  }

  logout() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
    });
    this.router.navigate(['login']);
  }

  login(uid: string): Observable<Claims> {
    return this.http.post<Claims>(this.url + 'login', { id: uid });
  }
  // getJWT() {
  //   return this.auth.user.subscribe((current) => current?.getIdToken());
  // }

  // async signIn() {
  //   const log = await this.auth.signInWithPopup(new GoogleAuthProvider());
  //   const result = await log.user?.getIdTokenResult();
  //   const tok = result;
  //   console.log(tok);
  // }
  async signIn(email: string, password: string) {
    const auth = getAuth();
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const currentUser = await userCredentials.user;
    this.curentName.next(currentUser.uid);
    this.adminUid.next({
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
    });
    localStorage.removeItem('roles');
  }

  async tokenSignIn(token: string) {
    const auth = getAuth();
    const userCredentials = await signInWithCustomToken(auth, token);
    const currentUser = await userCredentials.user;
    await currentUser.getIdTokenResult().then((data) => {
      let roles: Roles = {
        uid: currentUser.uid,
        isAdmin: data.claims['isAdmin'],
      };
      localStorage.removeItem('roles');
      localStorage.setItem('roles', JSON.stringify(roles));
      // if (!roles.isAdmin) {
      //   this.currentError.next(false);
      // }
    });
  }

  googleLogin() {
    let db = getFirestore();
    this.auth.signInWithPopup(new GoogleAuthProvider()).then(async (result) => {
      result.user?.getIdToken().then((token) => {
        localStorage.setItem('admin', token);
        this.router.navigate(['myadmin']);
        // this.user = this.getUser(token) as UserModel;
        // if (this.user.admin) {
        //   this.router.navigate(['myadmin']);
        // } else {
        //   alert('Invalid log in credentials');
        //   localStorage.removeItem('admin');
        //   this.router.navigate(['login']);
        // }
      });
    });
  }

  signOut() {
    const auth = getAuth();
    auth.signOut();
  }

  getFromServer() {
    return this.http.get(this.url);
  }
}
