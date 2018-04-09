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
    
    this.players = this.firebaseService.getItems();
    /*
    this.players = [
    {
      id: '1', 
      img: './assets/imgs/Michaela.png',
      name: 'Michaela'
    }, {
      id: '2',
      img: './assets/imgs/Melanie.png',
      name: 'Melanie'
    }];
    */
  }

 
  openModal(player) {

    let myModal = this.modalCtrl.create(PlayerModalPage, player);

    myModal.onDidDismiss(player => {
      if(player && player !== 'null' && player !== 'undefined') {
        console.log("onDidDismiss"+player.name);
        if(player.key != null){
          //Update player
          this.firebaseService.updateItem(player.key, player);           
        } else if(player.name && player.name !== 'null' && player.name !== 'undefined') {
          //Add new player
          this.firebaseService.addItem(player);
        }
      }
    });
    myModal.present();
    
  }

  deleteItem(item, slidingItem: ItemSliding){
    this.firebaseService.deleteItem(item.key);
    this.players = this.firebaseService.getItems();
    slidingItem.close();
  }
}
