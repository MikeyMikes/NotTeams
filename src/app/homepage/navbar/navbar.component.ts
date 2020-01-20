import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }

  signOut(){
    this._authService.signOut();
  }

  getUserTheme() {
    return this._authService.theme;
  }

}
