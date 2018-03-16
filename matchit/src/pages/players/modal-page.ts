import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal-page.html'
  })
export class PlayerModalPage {
    buttonText = "Add Player";
    newPlayer = {
      id: '',
      img: './assets/imgs/avatar.png',
      name: ''
    };
    

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    if(this.navParams.get('id') > -1){
      this.buttonText = "Update Player";
      this.newPlayer = {
        id: this.navParams.get('id'),
        img: this.navParams.get('img'),
        name: this.navParams.get('name')
      };
    }
  }
  closeModal(newPlayer) {
    this.viewCtrl.dismiss(this.newPlayer);
  }

}