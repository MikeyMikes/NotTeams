import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {

  emailInput;
  passwordInput;
  private readonly notifier: NotifierService;

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  signIn(){
    this._authService.signIn(this.emailInput, this.passwordInput);
  }

  handleKeydown(event){
    if(event.keyCode == 13){
      this.signIn();
    }
  }

}
