import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ItemSliding } from 'ionic-angular';
import { PlayerModalPage } from './modal-page';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  public players = [];

  constructor(public navCtrl: NavController, private camera: Camera, public modalCtrl: ModalController) {
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
  
  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  deleteItem(item, slidingItem: ItemSliding){
     const index = this.players.indexOf(item);
    this.players.splice(index, 1);
    slidingItem.close();
  }
}
