import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagingService } from 'src/app/services/messaging.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {

  inputMessage;
  @ViewChild('inputText', {static: false}) inputText; 

  constructor(private _messagingService: MessagingService, private _authService: AuthService) { }

  ngOnInit() {
  }

  handleInput(event){
    if(event.keyCode == 13){
      var messageID = (this._messagingService.messages.length + 1).toString();
      var date = new Date();
      this._messagingService.sendMessage(new Message(this.inputMessage, this._authService.username, messageID, date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear()
         + "  " + (date.getHours() % 12) + ":" + date.getMinutes() + ":" + date.getMinutes()));
      this.inputText.nativeElement.value = '';
      this.inputMessage = '';
    }
  }

  generateRandomMessageID(){
    return (Math.floor(Math.random() * 1000)).toString();
  }

  idExistsInMessages(messageID: string) : boolean{
    var exists = false;
    this._messagingService.messages.forEach(message => {
      if(message.messageID == messageID){
        exists = true;
      }
    })

    return exists;
  }
}
