import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  scoreRange = [];
  scoreMin = 1;
  scoreMax = 15;
  players: any[];
  
  constructor(public navCtrl: NavController) {
    for (let index = this.scoreMax; index >= this.scoreMin; index--) {
      this.scoreRange.push(index);
    }
    this.players = [
      {
        img: './assets/imgs/Michaela.png',
        name: 'Michaela'
      }, {
        img: './assets/imgs/Melanie.png',
        name: 'Melanie'
      }];
  
  }

}
