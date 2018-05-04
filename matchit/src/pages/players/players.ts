import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { PlayerModalPage } from './modal-page';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {

  @ViewChild(Content) content: Content;

  players: Observable<any[]>;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public firebaseService: FirebaseServiceProvider) {
    
    this.players = this.firebaseService.getPlayers();
  }

 
  openModal(player) {

    let myModal = this.modalCtrl.create(PlayerModalPage, player);

    myModal.onDidDismiss(player => {
      if(player && player !== 'null' && player !== 'undefined') {
        console.log("onDidDismiss"+player.name);
        if(player.key != null){
          //Update player
          this.firebaseService.updatePlayer(player.key, player);           
        } else {
          //Add new player
          this.firebaseService.addPlayer(player);
        }
      }
    });
    myModal.present();
    
  }

  deleteItem(item, slidingItem: ItemSliding){
    this.firebaseService.deletePlayer(item.key);
    this.players = this.firebaseService.getPlayers();
    slidingItem.close();
  }
}
