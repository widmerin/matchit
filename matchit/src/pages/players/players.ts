import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { PlayerModalPage } from './modal-page';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {

  public players = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
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
  }

  openModal(player) {

    let myModal = this.modalCtrl.create(PlayerModalPage, player);

    myModal.onDidDismiss(player => {
      if(player && player !== 'null' && player !== 'undefined') {
        console.log("onDidDismiss"+player.name);
        if(player.id > 0){
          //Update player
           for (var i in this.players) {
             if (this.players[i].id == player.id) {
                this.players[i].img = player.img;
                this.players[i].name = player.name;
                break; 
             }
           }
        } else {
          //Add new player
          player.id = this.players.length; //ToDo: Repalce id with DB id
          this.players.push(player);
        }
      }
    });
    myModal.present();
  }

  deleteItem(item, slidingItem: ItemSliding){
     const index = this.players.indexOf(item);
    this.players.splice(index, 1);
    slidingItem.close();
  }
}
