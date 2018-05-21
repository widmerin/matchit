import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { PlayerModalPage } from './modal-page';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {

  @ViewChild(Content) content: Content;

  players: Observable<any[]>;
  currentGroup: any;
   

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public firebaseService: FirebaseServiceProvider, private storage: Storage, public events: Events) {
    //set default group
    this.currentGroup = {key:"world"};
    //get currentGroup from local storage
    this.getCurrentGroup();
    //get players
    this.players = this.firebaseService.getPlayers();

    events.subscribe('functionCall:groupSet', (group) => {
      this.currentGroup = group;
    });
  }

 
  openModal(player) {

    let myModal = this.modalCtrl.create(PlayerModalPage, player);

    myModal.onDidDismiss(player => {

      //read local storage for currentGroup
      this.getCurrentGroup()

      if(player && player !== 'null' && player !== 'undefined') {
        console.log("onDidDismiss "+player.name);
        if(player.key != null){
          //Update player
          this.firebaseService.updatePlayer(player.key, player);           
        } else {
          //Add new player
          player.groupid = this.currentGroup.key; //set current group to new player
          this.firebaseService.addPlayer(player);
        }
      }
    });
    myModal.present();
  }

  //read local storage for currentGroup
  getCurrentGroup(){
    this.storage.get('group').then(val => {
      if(null!==val || undefined!==val) {
        this.currentGroup = val
      }else{
        this.currentGroup = {key:"world"};
      }
    });
  }

  deleteItem(item, slidingItem: ItemSliding){
    this.firebaseService.deletePlayer(item.key);
    this.players = this.firebaseService.getPlayers();
    slidingItem.close();
  }
}
