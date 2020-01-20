import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  displayNameFormControl = new FormControl('', [
    Validators.required
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  confirmPasswordFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();
  emailInput: string;
  displaynameInput: string;
  passwordInput: string;
  passwordInput2: string;

  constructor(private _authService: AuthService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signUp(){
    if(this.passwordInput == this.passwordInput2) {
      this._authService.signUp(this.emailInput, this.passwordInput, this.displaynameInput);
    } else {
      this._snackBar.open('Error:', 'Passwords must match', {
        duration: 2000,
      });
    }
  }

  handleKeydown(event){
    if(event.keyCode == 13){
      this.signUp();
    }
  }

}
