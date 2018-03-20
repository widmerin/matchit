import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal-page.html'
  })
export class PlayerModalPage {
    buttonText = "Add Player";
    newPlayer = {
      key: 0,
      img: './assets/imgs/avatar.png',
      name: ''
    };
    private options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false
    }
    

  constructor(public navParams: NavParams, public viewCtrl: ViewController, private camera: Camera) {
    if(this.navParams.get('key') >0){
      this.buttonText = "Update Player";
      this.newPlayer = {
        key: this.navParams.get('key'),
        img: this.navParams.get('img'),
        name: this.navParams.get('name')
      };
    }
  }
  closeModal(newPlayer) {
    this.viewCtrl.dismiss(this.newPlayer);
  }

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.newPlayer.img = base64Image;
    }, (err) => {
      // Handle error
      console.log("failed on taking picture");
    });
  }

}