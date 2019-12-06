import { Injectable, Injector } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { MessagingService } from './messaging.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  currentGroup;
  private messagingService: MessagingService;

  constructor(private _db: AngularFireDatabase, private _authService: AuthService, injector: Injector) {
    setTimeout(() => this.messagingService = injector.get(MessagingService));
   }

  joinGroup(groupToJoin){
    this._db.list(firebase.database().ref('/Groups/')).valueChanges().subscribe(groups => {
      var groupFound = false;
      
      groups.forEach(group => {
        if(group['groupID'] == groupToJoin){
          groupFound = true;
          this.currentGroup = groupToJoin;
          firebase.database().ref('Users/').child(this._authService.userID).child('Groups').child(groupToJoin).set({groupID: groupToJoin});
          this.messagingService.setRefs();
        }
      });

      if(!groupFound){
        alert('Group not found');
      }
    });
  }

  getAllGroupsUserBelongsTo(){
    console.log(this._db.list(firebase.database().ref('Users/' + this._authService.userID + '/Groups/')));
    return this._db.list(firebase.database().ref('Users/' + this._authService.userID + '/Groups/'));
  }

}
