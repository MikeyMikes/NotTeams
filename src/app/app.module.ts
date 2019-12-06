import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { RouterModule, Routes } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthguardService } from './services/authguard.service';
import { SignuppageComponent } from './signuppage/signuppage.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginpageComponent },
  { path: 'signup', component: SignuppageComponent },
  { path: 'home',  component: HomepageComponent, canActivate: [AuthguardService] },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
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
    SignuppageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
