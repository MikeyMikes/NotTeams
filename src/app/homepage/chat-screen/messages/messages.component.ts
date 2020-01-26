import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Inject, Injectable } from '@angular/core';
import { MessagingService, LovedMessage } from 'src/app/services/messaging.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditMessageDialogComponent } from '../edit-message-dialog/edit-message-dialog.component';
import { UploadService } from 'src/app/services/upload.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  @ViewChild('scroller', {static: false}) private chatContainer: ElementRef;
  hover : boolean = false;
  showVotes : boolean = false;

  constructor(private _messagingService: MessagingService, private _authService: AuthService, private _groupService: GroupService,
    private _db: AngularFireDatabase, private _dialog: MatDialog, private _uploadService: UploadService, private _angularFireAuth: AngularFireAuth,
    private _router: Router) { }

  ngOnInit() {
    this._messagingService.setRefs();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  messageBelongsToUser(message: Message){
    return message.user == this._authService.username;
  }

  getUserTheme() {
    return this._authService.theme;
  }

  getUserMessages() {
    return this._messagingService.messages;
  }
  
  likeMessage(id: string) {
    this._messagingService.likeMessage(id, "likedBy");
  }

  loveMessage(id: string) {
    this._messagingService.likeMessage(id, "lovedBy");
  }

  hateMessage(id: string) {
    this._messagingService.likeMessage(id, "hatedBy");
  }

  getProfileImgUrl(displayname: string) : string {
    var imgUrl = '/assets/user.png';
    this._messagingService.profileImages.forEach(image => {
      if(image.name == displayname && image.url != null) {
        imgUrl = image.url;
      }
    })
    
    return imgUrl;
  }

  openDeleteConfirmationDialog(id: string): void {
    const dialogRef = this._dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: id,
      autoFocus: false
    });
  }

  openEditDialog(message: Message): void {
    const dialogRef = this._dialog.open(EditMessageDialogComponent, {
      width: '400px',
      height: '250px',
      data: message,
      autoFocus: false
    });
  }

  getLikeCountForMessage(id: string) {
    let count = null;
    this._messagingService.listOfLikedMessages.forEach(likedMessage => {
      if(likedMessage.messageID == id) {
        count = likedMessage.likedBy.length;
      }
    })
    return count;
  }

  getLoveCountForMessage(id: string) {
    let count = null;
    this._messagingService.listOfLovedMessages.forEach(lovedMessage => {
      if(lovedMessage.messageID == id) {
        count = lovedMessage.lovedBy.length;
      }
    })
    return count;
  }

  getHateCountForMessage(id: string) {
    let count = null;
    this._messagingService.listOfHatedMessages.forEach(hatedMessage => {
      if(hatedMessage.messageID == id) {
        count = hatedMessage.hatedBy.length;
      }
    })
    return count;
  }

  getLikedBy(id) {
    var likedBy : string[] = []; 
    this._messagingService.listOfLikedMessages.forEach(likedMessage => {
      if(likedMessage.messageID == id) {
        likedMessage.likedBy.forEach(like => {
          if(!likedBy.includes(like["name"])) {
            likedBy.push(like["name"])
          }
        })
      }
    })
    return likedBy.toString().replace(/,/g, "\t");
  }

  getLovedBy(id) {
    var lovedBy : string[] = []; 
    this._messagingService.listOfLovedMessages.forEach(lovedMessage => {
      if(lovedMessage.messageID == id) {
        lovedMessage.lovedBy.forEach(love => {
          if(!lovedBy.includes(love["name"])) {
            lovedBy.push(love["name"])
          }
        })
      }
    })
    return lovedBy.toString().replace(/,/g, "\t");
  }

  getHatedBy(id) {
    var hatedBy : string[] = []; 
    this._messagingService.listOfHatedMessages.forEach(hatedMessage => {
      if(hatedMessage.messageID == id) {
        hatedMessage.hatedBy.forEach(hate => {
          if(!hatedBy.includes(hate["name"])) {
            hatedBy.push(hate["name"])
          }
        })
      }
    })
    return hatedBy.toString().replace(/,/g, "\t");
  }

  setShowVotes(showVotes: boolean) {
    this.showVotes = showVotes;
  }

}
