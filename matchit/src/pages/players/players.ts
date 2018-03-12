import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-players',
  templateUrl: 'players.html'
})
export class PlayersPage {

  players: any[];

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }


  constructor(public navCtrl: NavController, private camera: Camera) {
    this.players = [
    {
      img: './assets/imgs/Michaela.png',
      name: 'Michaela'
    }, {
      img: './assets/imgs/Melanie.png',
      name: 'Melanie'
    }];

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

  deleteItem(item: ItemSliding){
    //ToDo: Delete element in list
    let index = this.players.indexOf(item);

    if(index > -1){
      this.players.splice(index, 1);
    }
    item.close();
  }

  editItem(item: ItemSliding){
    //ToDo: Edit element in list
    console.log("edit"+item.name);
    item.close();
  }
}
