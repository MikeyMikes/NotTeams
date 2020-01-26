import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './homepage/navbar/navbar.component';
import { ChatScreenComponent } from './homepage/chat-screen/chat-screen.component';
import { ChatInputComponent } from './homepage/chat-screen/chat-input/chat-input.component';
import { MessagesComponent } from './homepage/chat-screen/messages/messages.component';
import { UsersGroupComponent } from './homepage/chat-screen/users-group/users-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthguardService } from './services/authguard.service';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import { NotifierModule } from "angular-notifier";
import { ProfilepageComponent } from './profilepage/profilepage.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from './homepage/chat-screen/delete-confirmation-dialog/delete-confirmation-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { EditMessageDialogComponent } from './homepage/chat-screen/edit-message-dialog/edit-message-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {path: '', component: LoginpageComponent},
  { path: 'login', component: LoginpageComponent },
  { path: 'signup', component: SignuppageComponent },
  { path: 'home',  component: HomepageComponent, canActivate: [AuthguardService] },
  { path: 'profile', component: ProfilepageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavbarComponent,
    ChatScreenComponent,
    ChatInputComponent,
    MessagesComponent,
    UsersGroupComponent,
    LoginpageComponent,
    SignuppageComponent,
    ProfilepageComponent,
    DeleteConfirmationDialogComponent,
    EditMessageDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MatDividerModule,
    MatBadgeModule,
    NotifierModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    NgbModule
  ],
  providers: [AngularFireStorage],
  entryComponents: [DeleteConfirmationDialogComponent, EditMessageDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
