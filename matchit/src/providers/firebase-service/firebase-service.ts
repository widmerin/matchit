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
  groupsRef: AngularFireList<any>;

  players: Observable<any[]>;
  scores: Observable<any[]>;
  groups: Observable<any[]>;

  constructor(public afd: AngularFireDatabase) {
    this.playersRef = this.afd.list('/players/');
    this.scoreRef = this.afd.list('/scores/');
    this.groupsRef = this.afd.list('/groups/');

    this.players = this.playersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.playersRef.push({ name: 'Michaela', img: './assets/imgs/Michaela.png' , groupID: '-LCyP0s2XwISI7_yjZKK'});
    // this.playersRef.push({ name: 'Melanie', img: './assets/imgs/Melanie.png' , groupID: '-LCyT0D7IimKfrfOqIF-'});


    this.scores = this.scoreRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.scoreRef.push({ playerL: '222', playerR: '333', scoreL: '5', scoreR: '15', matchdate: '23423432432' });
    // this.scoreRef.push({ playerL: '222', playerR: '444', scoreL: '15', scoreR: '14' , matchdate: '23423432433' });

    this.groups = this.groupsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.groupsRef.push({ name: 'A-Team', img: './assets/imgs/Michaela.png' });
    // this.groupsRef.push({ name: 'FHNW', img: './assets/imgs/Melanie.png' });

  }

  // Scores
 
  getScores() {
     return this.scores.map(score => {
         return score.reverse();
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

  // Players

  getPlayers() {
    return this.players.map(player => {
       return player.sort(function(a,b){
          return a.name.localeCompare(b.name);
      })
   });
  }

  addPlayer(player) {
    return this.playersRef.push({
      name: player.name,
      img: player.img,
      groupID: player.groupID
    });
  }

  updatePlayer(key, player) {
    return this.playersRef.update(
      key, {
        name: player.name,
        img: player.img,
        groupID: player.groupID
      });
  }

  deletePlayer(key) {
    this.playersRef.remove(key);
  }

  // Groups

  getGroups() {
    return this.groups.map(group => {
       return group.sort(function(a,b){
          return a.name.localeCompare(b.name);
      })
   });
  }

  addGroup(group) {
    return this.groupsRef.push({
      name: group.name,
      img: group.img
    });
  }

  updateGroup(key, group) {
    return this.groupsRef.update(
      key, {
        name: group.name,
        img: group.img
      });
  }

  deleteGroup(key) {
    this.groupsRef.remove(key);
  }

  // Scores Statistics

  getScoreForPlayer(key){
    return this.scores.map(items =>
      items.filter(score => score.playerLeft === key || score.playerRight === key));
  }

}
