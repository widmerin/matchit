import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';


@Component({
  selector: 'modal-page',
  templateUrl: 'modal-page.html'
})

export class PlayerModalPage {
    buttonText = "Add Player";
    newPlayer = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: '',
      groupid: ''
    };
    groups: Observable<any[]>; 

    private options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      saveToPhotoAlbum: false,
      targetWidth: 600,
      targetHeight: 600
    }
  

  constructor(public navParams: NavParams, public viewCtrl: ViewController, private camera: Camera, public firebaseService: FirebaseServiceProvider) {
    
     //get Groups (all)
     this.groups = this.firebaseService.getGroups();

      
    if(this.navParams.get('key') != null){
      //player modal opend with player to edit
      this.buttonText = "Update Player";
      this.newPlayer = {
        key: this.navParams.get('key'),
        img: this.navParams.get('img'),
        name: this.navParams.get('name'),
        groupid: this.navParams.get('groupid')
      };
    }
  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

  saveModal(newPlayer) {
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