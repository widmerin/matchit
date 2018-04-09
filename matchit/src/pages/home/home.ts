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
  isMatchInvalid = true;

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
      scoreLeft: 0,
      playerLeft: this.playerLeft.key,
      scoreRight: 0,
      playerRight: this.playerRight.key
    }

  }

  getMatchInvalid() {
    this.isMatchInvalid = this.match.scoreRight === 0; //&& this.match.scoreLeft === 0 || this.match.playerLeft === null || this.match.playerRight === null;
  }

}

