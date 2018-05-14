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
  playersLeft: Observable<any[]>;
  playersRight: Observable<any[]>;
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
    this.playersLeft = this.players;
    this.playersRight = this.players;
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


  updateStatsLeft() {
    let keyLeft = this.score.playerLeft.key;
    this.playersRight = this.filterPlayer(keyLeft);
    
  }

  updateStatsRight() {
    let keyRight = this.score.playerRight.key;
    this.playersLeft = this.filterPlayer(keyRight);      
  }


  filterPlayer(key){
    if(key!=null) {
      return this.players.map(items => items.filter(p => p.key != key))
    } else {
      return this.players;
    }
  }

  
  saveScore(){
    if(!this.getMatchInvalid()) {
     this.firebaseService.addScore(this.score);

      //reset score
      this.score.scoreLeft = null;
      this.score.scoreRight = null;
    }

  }


}
