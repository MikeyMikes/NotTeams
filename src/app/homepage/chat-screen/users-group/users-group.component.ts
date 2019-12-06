import { Component, OnInit } from '@angular/core';
import { MessagingService } from 'src/app/services/messaging.service';
import { GroupService } from 'src/app/services/group.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-users-group',
  templateUrl: './users-group.component.html',
  styleUrls: ['./users-group.component.css']
})
export class UsersGroupComponent implements OnInit {

  groupToJoin;
  groups = new Set();

  constructor(private _db: AngularFireDatabase, private _messagingService: MessagingService, private _groupService: GroupService) { }

  ngOnInit() {
    this.getAllGroupsUserBelongsTo();
  }

  getUsersInChatGroup(){
    var chatUsers : Set<string> = new Set();
    this._messagingService.messages.forEach(message => {
      chatUsers.add(message.user);
    })

    return chatUsers;
  }

  joinGroup(){
    this._groupService.joinGroup(this.groupToJoin);
    this.groupToJoin = null;
  }

  getAllGroupsUserBelongsTo(){
    this._groupService.getAllGroupsUserBelongsTo().valueChanges().subscribe(groups => {
      groups.forEach(group => {
        this.groups.add(group['groupID']);
      })
    });
  }

}
