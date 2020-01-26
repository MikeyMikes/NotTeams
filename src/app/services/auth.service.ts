import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadService } from './upload.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  signedIn: boolean;
  username;
  displayname;
  userID;
  theme;
  censorshipEnabled;
  profileImg;
  //currentAuth;

  constructor(private _afAuth: AngularFireAuth, private _db: AngularFireDatabase, private router: Router, private _snackBar: MatSnackBar) { }
  
  ngOnInit() {
  }

  setFields(user: firebase.User) {
      this.userID = user.uid;
      this.signedIn = true;
      this.username = user.email;
      this.getUserTheme();
      this.getUserProfileImage();
      this.getCensorshipEnabled();
      var that = this;
      new Promise(function(resolve, reject) {
        that._db.object(firebase.database().ref('/Users/' + that.userID + '/displayname/')).valueChanges().subscribe( dname => {
          that.displayname = dname;
          resolve();
        });
      }).then(function(value) {
        that.router.navigate(['/home']); 
      })
    
  }

  signIn(email, password) {
    this._afAuth.auth.signInWithEmailAndPassword(email, password).then(auth => {
      //this.currentAuth = auth;
      this.setFields(auth.user);
    }).catch(e => {
      this._snackBar.open('Error', e, {
        duration: 5000,
      });
    });
  }

  signUp(email, password, displayname) {
    this._afAuth.auth.createUserWithEmailAndPassword(email, password).then(auth => {
      this.createUser(auth, displayname);
      this._snackBar.open('Success:', 'Account successfully created!', {
        duration: 2000,
      });
      this.router.navigate(['/']);
    }).catch(e => {
      this._snackBar.open('Error:', e, {
        duration: 5000,
      });
    })
  }

  createUser(auth: firebase.auth.UserCredential, displayname: string) {
    firebase.database().ref('Users/').child(auth.user.uid).set({displayname: displayname, email: auth.user.email, id: auth.user.uid});
  }

  signOut() {
    this._afAuth.auth.signOut().then(user => {
      console.log(user + ' signed out');
      this.signedIn = false;
      this.username = null;
      this.router.navigate(['/']);
    });
  }

  getUserDisplayName() {
    var promise = new Promise((resolve, reject) => {
      this._db.object(firebase.database().ref('/Users/' + this.userID + '/displayname/')).valueChanges().subscribe( dname => {
        this.displayname = dname;
      });

      if(this.displayname == null){
        reject();
      }else{
        resolve();
      }
    });
  }

  setUserDisplayName(displayname: string) {
    firebase.database().ref('Users/').child(this.userID).child("displayname").set(displayname);
  }

  getUserTheme() {
    this._db.object(firebase.database().ref('/Users/' + this.userID).child("theme")).valueChanges().subscribe( theme => {
      this.theme = theme;
    });
  }

  setUserTheme(theme: string) {
    this.theme = theme;
    firebase.database().ref('Users/').child(this.userID).child("theme").set(theme);
  }

  setCensorshipEnabled(censorshipEnabled: boolean) {
    console.log("setting it to " + censorshipEnabled)
    this.censorshipEnabled = censorshipEnabled;
    firebase.database().ref('Users/').child(this.userID).child("censorshipEnabled").set(censorshipEnabled);
  }

  getCensorshipEnabled() {
    this._db.object(firebase.database().ref('/Users/' + this.userID).child("censorshipEnabled")).valueChanges().subscribe( ce => {
      this.censorshipEnabled = ce;
    });
  }

  getUserProfileImage() {
    this._db.object(firebase.database().ref('/Users/' + this.userID).child("profileImg")).valueChanges().subscribe( img => {
      this.profileImg = String(img);
    });
  }

}
