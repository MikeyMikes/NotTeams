import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MessagingService } from 'src/app/services/messaging.service';
import { Message } from 'src/app/models/message.model';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-edit-message-dialog',
  templateUrl: './edit-message-dialog.component.html',
  styleUrls: ['./edit-message-dialog.component.css']
})
export class EditMessageDialogComponent implements OnInit {

  @ViewChild('editInput', {static: false}) private input: ElementRef;
  newMessageText;

  constructor(
    public dialogRef: MatDialogRef<EditMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: Message, private _messagingService: MessagingService, private _cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.newMessageText = this.message.messageText;
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    this._cd.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editMessage() {
    this._messagingService.editMessage(this.message, this.newMessageText);
    this.dialogRef.close();
  }

  handleKeydown(event) {
    if(event.keyCode == 13) {
      this.editMessage();
    }
  }

}
