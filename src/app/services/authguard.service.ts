import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private _authService: AuthService, private _router: Router, private _sb: MatSnackBar, private af: AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // return this.af.authState
    //    .pipe(take(1))
    //    .pipe(map(user => !!user))
    //    .pipe(tap(loggedIn => {
    //      console.log('well: ' + loggedIn)
    //      if (!loggedIn) {
    //        console.log("access denied")
    //        this._router.navigate(['/login']);
    //      }
    //  }))

    return new Promise(resolve => {
      this.af.authState.subscribe(firebaseUser => {
        if(firebaseUser) {
          //console.log('im real: ' + this._authService.currentAuth)
          this._authService.setFields(firebaseUser)
          resolve(true)
          return
        }

        this._router.navigate(['/'])
        resolve(false)
      })
    })

    // return new Promise((resolve, reject) => {
    //   firebase.auth().onAuthStateChanged((user: firebase.User) => {
    //     if (user) {
    //       console.log('User is logged in');
    //       resolve(true);
    //     } else {
    //       console.log('User is not logged in');
    //       this._router.navigate(['/']);
    //       resolve(false);
    //     }
    //   });
    // });
    
  }  
  
}
