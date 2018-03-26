import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  players: Observable<any[]>;
  
  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider) {
    this.players = this.firebaseService.getItems();
  }

}
