import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/images';
  file: File;

  constructor(private _afStorage: AngularFireStorage, private _authService: AuthService) { }

  handleFiles(event) {
    this.file = event.target.files[0];
  }

  async uploadFile() {
    if (this.file) {
      const filePath = `${this.basePath}/${this.file.name}`;
      const snap = await this._afStorage.upload(filePath, this.file);
      this.getUrl(snap);
    }
  }

  private async getUrl(snap: UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    this._authService.profileImg = url;
    this.commitImageToDatabase(url);
  }

  private commitImageToDatabase(url: string) {
    firebase.database().ref('Users/').child(this._authService.userID).child("profileImg").set(url);
  }

}
