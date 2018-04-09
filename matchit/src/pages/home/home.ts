import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;

  scoreRange = [];
  scoreMin = 0;
  scoreMax = 15;
  playerLeft: any;
  playerRight: any;
  players: Observable<any[]>;
  match: any;

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider) {
    for (let index = this.scoreMax; index >= this.scoreMin; index--) {
      this.scoreRange.push(index);
    }

    this.players = this.firebaseService.getItems();

    this.playerLeft = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };

    this.playerRight = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };

    this.match = {
      datetime: null,
      scoreLeft: null,
      playerLeft: this.playerLeft.key,
      scoreRight: null,
      playerRight: this.playerRight.key
    }

  }

  getMatchInvalid() {
    //return invalid
    return !(// valid conditions:
      //not null 
      (this.match.scoreRight !== null && this.match.scoreLeft !== null
        && this.match.playerLeft !== null && this.match.playerRight !== null)
      //valid scores
      || (this.match.scoreRight < 15 && this.match.scoreLeft === 15)
      || (this.match.scoreRight === 15 && this.match.scoreLeft < 15)
      || (this.match.scoreRight === 9 && this.match.scoreLeft === 0)
      || (this.match.scoreRight === 0 && this.match.scoreLeft === 9)
    )
  }

}
