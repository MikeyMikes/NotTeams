import { Injectable, OnInit, OnChanges, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Message } from '../models/message.model';
import { GroupService } from './group.service';
import { AuthService } from './auth.service';
import { take, first } from 'rxjs/operators';

export class LikedMessage extends Message {
  messageText: string;
  messageID;
  likedBy: string[];

  constructor(messageText: string, messageID: string, likedBy: string[]) {
    super(messageText, "", "", messageID, "", likedBy, "", "");
  }
}

export class LovedMessage extends Message {
  messageText: string;
  messageID;
  lovedBy: string[];

  constructor(messageText: string, messageID: string, lovedBy: string[]) {
    super(messageText, "", "", messageID, "", "", lovedBy, "");
  }
}

export class HatedMessage extends Message {
  messageText: string;
  messageID;
  hatedBy: string[];

  constructor(messageText: string, messageID: string, hatedBy: string[]) {
    super(messageText, "", "", messageID, "", "", "", hatedBy);
  }
}

export interface Like {
  name: string;
  id: string;
}

export class ProfileImage {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService implements OnInit {

  messages: Message[] = [];
  profileImages: ProfileImage[] = [];
  private groupRef;
  private totalMessageCount : number;
  listOfLikedMessages : LikedMessage[] = [];
  listOfLovedMessages : LovedMessage[] = [];
  listOfHatedMessages : HatedMessage[] = [];
  loaded = false;

  constructor(private afAuth: AngularFireAuth, private _db: AngularFireDatabase, private _groupService: GroupService,
    private _authService: AuthService) { }

  ngOnInit() {
    this.setRefs();
  }

  setRefs() {
    this.afAuth.authState.subscribe(firebaseUser => {
      if(firebaseUser){
        this.groupRef = firebase.database().ref('Groups/' + this._groupService.currentGroup + '/messages/');
        this.groupRef.limitToLast(2).on("child_added", function(snapshot) {});
        this.loadMessages();
      } else {
        console.log('not logged in');
      }
    });
  }

  sendMessage(message: Message) {
    this.groupRef.child(message.messageID).setWithPriority(
      {messageText: message.messageText, user: message.user, displayname: message.displayname, messageID: message.messageID, timestamp: message.timestamp},
      message.messageID
    );
    this.loadMessages();
  }

  deleteMessage(id: string) {
    this.groupRef.child(id).remove();
    this.setMessageCount();
    this.loadMessages();
  }

  editMessage(message: Message, newMessageText: string) {
    this.groupRef.child(message.messageID).child("messageText").set(newMessageText);
    this.loadMessages();
  }

  likeMessage(id: string, type: string) {
    this.messages.forEach(message => {
      if(message.messageID == id) {
        let likedBy = this.setLikedBy(message, type);
        likedBy.then(peopleThatLiked => {
          var userAlreadyLikedMessage = peopleThatLiked.find(item => {
            return item.name == this._authService.displayname;
          })
          if(!userAlreadyLikedMessage) {
            firebase.database().ref('Groups/').child(this._groupService.currentGroup).child("messages").child(message.messageID)
              .child(type).child(peopleThatLiked.length + "").set({name: this._authService.displayname, id: peopleThatLiked.length}) 
              this.removeExtraLikes(message, type);
          } else {
            this.removeLike(peopleThatLiked, message, type)
          }
        }) 
      }
    })
  }

  private removeLike(peopleThatLiked: Like[], message: Message, type: string) {
    peopleThatLiked.forEach(item => {
      if(item.name == this._authService.displayname) {
        firebase.database().ref('Groups/').child(this._groupService.currentGroup).child("messages").child(message.messageID)
          .child(type).child(item.id + "").remove();
      }
    })
  }

  private loadMessages() {
    var messagesList: AngularFireList<any> = this._db.list(this.groupRef, ref => ref.limitToLast(25));
    this.messages = [];
    this.profileImages = [];
    this.listOfLikedMessages = [];
    this.listOfLovedMessages = [];
    this.listOfHatedMessages = [];
    messagesList.valueChanges().subscribe(messages => {
      messages.forEach(message => {
        var msg = new Message(message.messageText, message.user, message.displayname,
          message.messageID, message.timestamp, message.likedBy, message.lovedBy, message.hatedBy);
        if(this.messageIsUnique(msg)) {
          if(this._authService.censorshipEnabled) {
            msg = this.censorSwearWords(msg);
          }
          this.messages.push(msg);
          this.setLikesForMessage(msg);
          this.setLovesForMessage(msg);
          this.setHatesForMessage(msg);
        }
      });
    });
    this.setMessageCount();
    this.setProfileImages();
  }

  private setLikesForMessage(msg: Message) {
    var that = this;
    return new Promise(function(resolve, reject) {
      if(msg.likedBy != null) {
        msg.likedBy.forEach(like => {
          that.listOfLikedMessages.push(new LikedMessage(msg.messageText, msg.messageID, msg.likedBy))
        })
      }
      resolve();
    })
  }

  private setLovesForMessage(msg: Message) {
    var that = this;
    return new Promise(function(resolve, reject) {
      if(msg.lovedBy != null) {
        msg.lovedBy.forEach(love => {
          that.listOfLovedMessages.push(new LovedMessage(msg.messageText, msg.messageID, msg.lovedBy))
        })
      }
      resolve();
    })
  }

  private setHatesForMessage(msg: Message) {
    var that = this;
    return new Promise(function(resolve, reject) {
      if(msg.hatedBy != null) {
        msg.hatedBy.forEach(love => {
          that.listOfHatedMessages.push(new HatedMessage(msg.messageText, msg.messageID, msg.hatedBy))
        })
      }
      resolve();
    })
  }

  private setProfileImages() {
    var usersList: AngularFireList<any> = this._db.list(firebase.database().ref('Users/'));
    usersList.valueChanges().subscribe(userList => {
      userList.forEach(user => {
        this.profileImages.push(new ProfileImage(user["displayname"], user["profileImg"]));
      })
      this.loaded = true;
    })
  }

  private setMessageCount() {
    this._db.list(this.groupRef).valueChanges().subscribe(messages => {
      this.totalMessageCount = messages.length;
    })
  }

  private setLikedBy(message: Message, type: string) : Promise<Like[]> {
    return new Promise(resolve => {
      let messageList : AngularFireObject<Message[]> = this._db.object(this.groupRef);
      messageList.valueChanges().subscribe(messages => {
        messages.forEach(storedMessage => {
          if(storedMessage.messageID == message.messageID) {
            let peopleThatLikedList : AngularFireObject<any> = this._db.object(firebase.database()
              .ref('Groups/' + this._groupService.currentGroup + '/messages/' + message.messageID + "/" + type + "/"));
            var likedBy : Like[] = [];
            peopleThatLikedList.valueChanges().pipe(take(1)).subscribe(peopleThatLiked => {
              if(peopleThatLiked == null) {
                peopleThatLiked = []
              }
              peopleThatLiked.forEach(personThatLiked => {
                likedBy.push({name: personThatLiked.name, id: personThatLiked.id})
              }) 
              resolve(likedBy);
            }) 
          }
        })
      })
    })
  }

  messageIsUnique(message: Message) {
    return !this.messages.some(item => {
      return item.messageID === message.messageID;
    })
  }

  getLastMessageID() : Promise<string> {
    return new Promise(resolve => {
      var lastMessageList: AngularFireList<any> = this._db.list(this.groupRef, ref => ref.limitToLast(1))
      lastMessageList.valueChanges().subscribe(messageList => {
        messageList.forEach(message => {
          resolve(message.messageID)
        })
      })
    })
  }

  private removeExtraLikes(message: Message, type: string) {
    this.setLikedBy(message, "likedBy")
      .then(peopleThatLiked => {
      this.setLikedBy(message, "lovedBy")
        .then(peopleThatLoved => {
          this.setLikedBy(message, "hatedBy")
            .then(peopleThatHated => {
              if(type == "likedBy") {
                this.removeLike(peopleThatLoved, message, "lovedBy");
                this.removeLike(peopleThatHated, message, "hatedBy");
              } else if(type == "lovedBy") {
                this.removeLike(peopleThatLiked, message, "likedBy");
                this.removeLike(peopleThatHated, message, "hatedBy");
              }  else if(type == "hatedBy") {
                this.removeLike(peopleThatLiked, message, "likedBy");
                this.removeLike(peopleThatLoved, message, "lovedBy");
              }
          })
      })
    })
  }

  censorSwearWords(message: Message) : Message{
    var badWords = { "fuck":"frick", "fucking":"friggin", "fucked":"fricked", "motherfucker":"motherfudger",
                     "cunt":"no-no square", "pussy":"vbox", "ass":"backside", "asshole":"one of those people that goes slow in the left lane",
                      "shit":"Grown Ups 2", "shitting": "dumping", "bullshit":"bull corn", "shithead": "not cool person",
                     "retard":"silly", "retarded":"silly", "dick":"Lexis driver", "douche":"BMW driver", "douchebag":"BMW driver", "bitch":"female pupper",
                     "bitching":"complaining", "bitched":"complained", "damn":"darn", "damned":"dang", "goddamn":"gosh dang it",
                     "goddamned":"gosh darned", "hell":"heck",
                     "whore":"strong, independent woman", "slut":"very friendly person" }

    var words = message.messageText.split(' ')
    var finishedMessage = [];
    words.forEach((word) => {
      if(word.toLowerCase() in badWords) {
        finishedMessage.push(badWords[word]);
      } else {
        finishedMessage.push(word);
      }
    })
    message.messageText = finishedMessage.join(' ');
    return message;
  }

}
