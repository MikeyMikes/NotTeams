import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signedIn: boolean;
  username;
  userID;

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  signIn(email, password){
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(auth => {
      this.userID = auth.user.uid;
      this.signedIn = true;
      this.username = auth.user.email;
      this.router.navigate(['/home']);
    });
  }

  signUp(email, password){
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(auth => {
      this.createUser(auth);
      alert('Account succesfully created!');
      this.router.navigate(['/']);
    }).catch(e => {
      alert(e);
    })
  }

  createUser(auth: firebase.auth.UserCredential){
    firebase.database().ref('Users/').child(auth.user.uid).set({displayname: auth.user.displayName, email: auth.user.email, id: auth.user.uid});
  }

  signOut(){
    this.afAuth.auth.signOut().then(user => {
      console.log(user + ' signed out');
      this.signedIn = false;
      this.username = null;
      this.router.navigate(['/']);
    });
  }
}
