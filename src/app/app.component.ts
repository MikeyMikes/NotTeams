import { Component, IterableDiffers, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'NotTeams™';
  private iterableDiffer;
  private unreadMessages: number = 0;

  public constructor(private titleService: Title, private messagingService: MessagingService, private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(null); 
  }

  ngDoCheck() {
    if(!document.hasFocus()) {
      let changes = this.iterableDiffer.diff(this.messagingService.messages);
      if(changes) {
        this.unreadMessages++;
        var displayableNumber : number = parseInt(((this.unreadMessages - 1) / 3).toFixed(0));
        if(displayableNumber != 0) {
          this.titleService.setTitle("(" + displayableNumber + " unread)" + " NotTeams™");
        }
      }
    } else {
      this.unreadMessages = 0;
      this.titleService.setTitle("NotTeams™");
    }
  }

}
