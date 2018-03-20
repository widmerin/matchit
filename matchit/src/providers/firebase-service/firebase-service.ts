import { HttpClient } from '@angular/common/http';
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
  items: Observable<any[]>;

  constructor(public afd: AngularFireDatabase) {
    this.itemsRef = this.afd.list('/matchit/');
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
   // two players for debug/testing
   // this.itemsRef.push({ name: 'Michaela', img: './assets/imgs/Michaela.png' });
   // this.itemsRef.push({ name: 'Melanie', img: './assets/imgs/Melanie.png' });
     
  }

  getItems() {
    return this.items;
  }

  addItem(player) {
    return this.itemsRef.push({ name: player.name, img: player.img });
  }

  updateItem(key, player) {
    return this.itemsRef.update(key, { name: player.name, img: player.img });
  }

  deleteItem(key) {
    this.itemsRef.remove(key);
  }

}
