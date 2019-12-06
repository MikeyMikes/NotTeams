import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent implements OnInit {

  emailInput: string;
  passwordInput: string;
  passwordInput2: string;

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  signUp(){
    this._authService.signUp(this.emailInput, this.passwordInput);
  }

  checkValidations(){
    var valid = true;

    if(this.emailInput == null || !this.emailInput.includes('@')){
      alert('Email must be valid');
      valid = false;
    }
    if(this.passwordInput == null || this.passwordInput2 == null ||
      this.passwordInput == '' || this.passwordInput2 == ''){
      alert('Password is required');
      valid = false;
    }
    if(this.passwordInput.length < 6){
      alert('Password must contain at least 6 characters');
      valid = false;
    }
    if(this.passwordInput != this.passwordInput2){
      alert('Passwords must match');
      valid = false;
    }

    if(valid){
      this.signUp();
    }
  }

  handleKeydown(event){
    if(event.keyCode == 13){
      this.checkValidations();
    }
  }

}
