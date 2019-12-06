import { Injectable, OnInit, OnChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Message } from '../models/message.model';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class MessagingService implements OnInit {

  messages: Message[] = [];
  groupRef;
  userRef;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private _groupService: GroupService) { }

  ngOnInit(){
    this.setRefs();
  }

  setRefs(){
    this.afAuth.authState.subscribe(firebaseUser => {
      if(firebaseUser){
        this.groupRef = firebase.database().ref('Groups/' + this._groupService.currentGroup + '/messages/');
        this.userRef = firebase.database().ref('Users/');
        this.loadMessages();
      }else{
        console.log('not logged in');
      }
    });
  }

  sendMessage(message: Message){
    this.groupRef.child(message.messageID).set({messageText: message.messageText, user: message.user, messageID: message.messageID, timestamp: message.timestamp});
  }

  loadMessages(){
    var messagesList: AngularFireList<any> = this.db.list(this.groupRef);
    messagesList.valueChanges().subscribe(messages =>{
      messages.forEach(message => {
        var msg = new Message(message.messageText, message.user, message.messageID, message.timestamp);
        if(this.messageIsUnique(msg)){
          this.messages.push(msg);
        }
      });
    });
  }

  messageIsUnique(message: Message){
    var unique = true;
    this.messages.forEach(storedMessage => {
      if(storedMessage.messageID == message.messageID){
        unique = false;
      }
    });

    return unique;
  }

}
