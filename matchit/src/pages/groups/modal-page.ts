import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal-page.html'
  })

export class GroupsModalPage {
    buttonText = "Add Group";
    newGroup = {
      key: null,
      img: './assets/imgs/groups.png',
      name: ''
    };
    
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
    

  constructor(public navParams: NavParams, public viewCtrl: ViewController, private camera: Camera) {
    if(this.navParams.get('key') != null){
      this.buttonText = "Update Group";
      this.newGroup = {
        key: this.navParams.get('key'),
        img: this.navParams.get('img'),
        name: this.navParams.get('name')
      };
    }
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  saveModal(newGroup) {
    this.viewCtrl.dismiss(this.newGroup);
  }


  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.newGroup.img = base64Image;
    }, (err) => {
      // Handle error
      console.log("failed on taking picture");
    });
  }

}