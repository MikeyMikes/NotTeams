import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessagingService } from 'src/app/services/messaging.service';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  @ViewChild('scroller', {static: false}) private chatContainer: ElementRef;

  constructor(public _messagingService: MessagingService, private _authService: AuthService) { }

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

}
