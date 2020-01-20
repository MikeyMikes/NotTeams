import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string, private _messagingService: MessagingService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteMessage() {
    this._messagingService.deleteMessage(this.id);
    this.dialogRef.close();
  }

}
