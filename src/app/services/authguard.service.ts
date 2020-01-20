import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private _authService: AuthService, private _router: Router, private _sb: MatSnackBar, private af: AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    console.log('asdfasdfasdf: ' + this.af.auth.currentUser.displayName);
    return this.af.authState
       .pipe(take(1))
       .pipe(map(user => !!user))
       .pipe(tap(loggedIn => {
         if (!loggedIn) {
           console.log("access denied")
           this._router.navigate(['/login']);
         }
     }))
  }  
  
}
