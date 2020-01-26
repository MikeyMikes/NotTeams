import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  
  constructor(private _authService: AuthService, private _angularFireAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  getUserTheme() {
    return this._authService.theme;
  }

}
