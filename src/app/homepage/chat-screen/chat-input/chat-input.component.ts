import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagingService } from 'src/app/services/messaging.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {

  inputMessage;
  @ViewChild('inputText', {static: false}) inputText; 

  constructor(private _messagingService: MessagingService, private _authService: AuthService, private _groupService: GroupService) { }

  ngOnInit() {
  }

  handleInput(event) {
    if(event.keyCode == 13) {
      if(this.inputMessage != null && this.inputMessage != "") {
        this._messagingService.getLastMessageID().then(id => {
          this._messagingService.sendMessage(new Message(this.inputMessage, this._authService.username, this._authService.displayname, 
              (parseInt(id) + 1).toString(), this.getCurrentDateAndTime(), Array.of({}), Array.of({}), Array.of({})));
          this.inputText.nativeElement.value = '';
          this.inputMessage = '';
        })
      }
    }
  }
 
  generateRandomMessageID(){
    return (Math.floor(Math.random() * 1000)).toString();
  }

  getCurrentDateAndTime() {
    var date = new Date();
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
            + "  " + this.getHours(date.getHours()) + ":" + this.getMinutes(date.getMinutes()) + ":" + this.getSeconds(date.getSeconds());
  }

  getHours(hours: number) {
    return (hours == 12) ? 12 : (hours % 12)
  }

  getMinutes(minutes: number) {
    return (minutes < 10) ? ("0" + minutes) : minutes;
  }

  getSeconds(seconds: number) {
    return (seconds < 10) ? ("0" + seconds) : seconds;
  }

  isUserCurrentlyInAnyGroup() {
    return this._groupService.currentGroup != null;
  }
}
