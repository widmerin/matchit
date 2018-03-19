import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PlayersPage } from '../pages/players/players';
import { StatsPage } from '../pages/stats/stats';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { Camera } from '@ionic-native/camera';  

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlayerModalPage } from '../pages/players/modal-page';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';

import { AngularFireDatabaseModule, AngularFireList } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { HttpModule, Http } from '@angular/http';


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTDMJ9KCKMppK1M0H2HnaviZCzbkiOUOk",
  authDomain: "matchit-wj.firebaseapp.com",
  databaseURL: "https://matchit-wj.firebaseio.com",
  projectId: "matchit-wj",
  storageBucket: "matchit-wj.appspot.com",
  messagingSenderId: "509435009023"
};

@NgModule({
  declarations: [
    MyApp,
    PlayersPage,
    StatsPage,
    HomePage,
    TabsPage,
    PlayerModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PlayersPage,
    StatsPage,
    HomePage,
    TabsPage,
    PlayerModalPage
  ],
  providers: [
    Camera,    
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseServiceProvider
  ]
})
export class AppModule {}
