import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
})
export class ProfilepageComponent implements OnInit {

  themes : string[] = ["Dark (Default)", "Blue", "Light"]
  newDisplayname;
  newTheme;
  censorshipStatus : boolean;

  constructor(public _authService: AuthService, private _snackBar: MatSnackBar, private _router: Router,
    private _uploadService: UploadService) { }

  ngOnInit() {
    this.censorshipStatus = this._authService.censorshipEnabled;
  }

  saveChanges() {
    let changed = false;
    if(this.newDisplayname != null && this.newDisplayname != "") {
      this._authService.setUserDisplayName(this.newDisplayname);
      changed = true;
    }
    if(this.newTheme != null && this.newTheme != "") {
      this._authService.setUserTheme(this.newTheme);
      changed = true;
    }

    this._uploadService.uploadFile();
    this._authService.setCensorshipEnabled(this.censorshipStatus);

    if(changed) {
      this._snackBar.open('Success:', 'Your profile has been updated!', {
        duration: 2000,
      });
    }

    this._router.navigate(['/home']);    
  }

  upload(event) {
    this._uploadService.handleFiles(event); 
  }

  handleKeydown(event){
    if(event.keyCode == 13){
      this.saveChanges();
    }
  }

  getUserTheme() {
    return this._authService.theme;
  }

  getDisplayname() {
    return this._authService.displayname;
  }

  getUsername() {
    return this._authService.username;
  }

  getUserProfileImage() {
    console.log("here: " + this._authService.profileImg)
    return (this._authService.profileImg == '') ? '/assets/user.png' : this._authService.profileImg;
  }

}
