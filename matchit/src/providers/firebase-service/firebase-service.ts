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

  itemsRef: AngularFireList<any>;
  scoreRef: AngularFireList<any>;
  items: Observable<any[]>;
  scores: Observable<any[]>;

  constructor(public afd: AngularFireDatabase) {
    this.itemsRef = this.afd.list('/players/');
    this.scoreRef = this.afd.list('/scores/');
    //this.scoreRef = this.adf.list('/scores/');

    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.itemsRef.push({ name: 'Michaela', img: './assets/imgs/Michaela.png' });
    // this.itemsRef.push({ name: 'Melanie', img: './assets/imgs/Melanie.png' });

 
    this.scores = this.scoreRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    // this.scoreRef.push({ playerL: '222', playerR: '333', scoreL: '5', scoreR: '15', matchdate: '23423432432' });
    // this.scoreRef.push({ playerL: '222', playerR: '444', scoreL: '15', scoreR: '14' , matchdate: '23423432433' });

  
     
  }

  getItems() {
    return this.items;
  }


  getScores() {
    return this.scores;
  }

  addItem(player) {
    return this.itemsRef.push({ 
      name: player.name, 
      img: player.img 
    });
  }

  addScore(score) {
    console.log(score);
    return this.scoreRef.push({ 
      playerLeft: score.playerLeft.key, 
      playerRight: score.playerRight.key, 
      scoreLeft: score.scoreLeft, 
      scoreRight: score.scoreRight, 
      Date : Date.now()
    });
  }

  updateItem(key, player) {
    return this.itemsRef.update(
      key, { 
        name: player.name, 
        img: player.img 
      });
  }

  deleteItem(key) {
    this.itemsRef.remove(key);
  }

}
