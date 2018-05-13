import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the FirebaseServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseServiceProvider {

  playersRef: AngularFireList<any>;
  scoreRef: AngularFireList<any>;
  players: Observable<any[]>;
  scores: Observable<any[]>;

  constructor(public afd: AngularFireDatabase) {
    this.playersRef = this.afd.list('/players/');
    this.scoreRef = this.afd.list('/scores/');

    this.players = this.playersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.playersRef.push({ name: 'Michaela', img: './assets/imgs/Michaela.png' });
    // this.playersRef.push({ name: 'Melanie', img: './assets/imgs/Melanie.png' });


    this.scores = this.scoreRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.scoreRef.push({ playerL: '222', playerR: '333', scoreL: '5', scoreR: '15', matchdate: '23423432432' });
    // this.scoreRef.push({ playerL: '222', playerR: '444', scoreL: '15', scoreR: '14' , matchdate: '23423432433' });



  }

  getPlayers() {
    return this.players;
  }


  getScores() {
     return this.scores.map(score => {
         return score.reverse();
     });
  }

  addPlayer(player) {
    return this.playersRef.push({
      name: player.name,
      img: player.img
    });
  }

  addScore(score) {
    return this.scoreRef.push({
      playerLeft: score.playerLeft,
      playerRight: score.playerRight,
      scoreLeft: score.scoreLeft,
      scoreRight: score.scoreRight,
      Date : Date.now()
    });
  }

  updatePlayer(key, player) {
    return this.playersRef.update(
      key, {
        name: player.name,
        img: player.img
      });
  }

  deletePlayer(key) {
    this.playersRef.remove(key);
  }

  getScoreForPlayer(key){
    return this.scores.map(items =>
      items.filter(score => score.playerLeft === key || score.playerRight === key));
  }

}
