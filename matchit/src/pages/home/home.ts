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
  score: any;

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider) {
    for (let index = this.scoreMax; index >= this.scoreMin; index--) {
      this.scoreRange.push(index);
    }

    this.players = this.firebaseService.getPlayers();

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

    this.score = {
      datetime: null,
      scoreLeft: null,
      playerLeft: this.playerLeft,
      scoreRight: null,
      playerRight: this.playerRight
    }

  }

  getMatchInvalid() {
    //return invalid
    return !(// valid conditions:
      //not null 
      (this.score.scoreRight !== null && this.score.scoreLeft !== null
        && this.score.playerLeft.key !== null && this.score.playerRight.key !== null) &&
      //valid scores
      ((this.score.scoreRight < 15 && this.score.scoreLeft === 15)
        || (this.score.scoreRight === 15 && this.score.scoreLeft < 15)
        || (this.score.scoreRight === 9 && this.score.scoreLeft === 0)
        || (this.score.scoreRight === 0 && this.score.scoreLeft === 9)
      )
    )
  }

  saveScore(){
    console.log(this.score);
    if(!this.getMatchInvalid()) {
       this.firebaseService.addScore(this.score);

      //reset score
      this.score.scoreLeft = null;
      this.score.scoreRight = null;
    }

  }
}
