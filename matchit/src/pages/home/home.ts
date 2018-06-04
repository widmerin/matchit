import { Component, ViewChild } from '@angular/core';
import { NavController, Content, Tabs } from 'ionic-angular';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;

  scoreRange = [];
  scoreMin = 0;
  scoreMax = 22;
  playerLeft: any;
  playerRight: any;
  players: Observable<any[]>;
  playersLeft: Observable<any[]>;
  playersRight: Observable<any[]>;
  score: any;
  scoreIsNotValid: boolean = false;
  groups: Observable<any[]>;
  currentGroup: any = {
      key: 'world',
      img: './assets/imgs/world.png',
      name: 'World'
  };

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider, private tabs:Tabs, private storage: Storage, public events: Events) {
    
    this.groups = this.firebaseService.getGroups();
    
    //get currentGroup from local storage
    this.getCurrentGroup();

    for (let index = this.scoreMax; index >= this.scoreMin; index--) {
      this.scoreRange.push(index);
    }

    this.setupPlayers();

    this.score = {
      datetime: null,
      scoreLeft: 0,
      playerLeft: this.playerLeft,
      scoreRight: 0,
      playerRight: this.playerRight
    }

    events.subscribe('functionCall:groupSet', (group) => {
      this.currentGroup = group;
      this.resetPlayers();
    });


    //get players
    this.players = this.firebaseService.getPlayers();
    this.updatePlayersLeft();
    this.updatePlayersRight();

  }


  switchTab(tabIndex) {
      this.tabs.select(tabIndex);
  }


  getMatchInvalid() {
    //return invalid
    return !(
      //valid scores
           (this.score.scoreRight < 10 && this.score.scoreLeft === 11)
        || (this.score.scoreRight === 11 && this.score.scoreLeft < 10)
        || (this.score.scoreRight > 9 && this.score.scoreLeft > this.score.scoreRight+1)
        || (this.score.scoreLeft > 9 && this.score.scoreRight > this.score.scoreLeft+1)    
      )
  }



  setupPlayers(){
    this.playerLeft = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };

    this.playerRight = {
      key: null,
      img: './assets/imgs/avatar.png',
      name: ''
    };
  }

  resetPlayers(){
    this.score.playerLeft = this.playerLeft;
    this.score.playerRight = this.playerRight;
    this.updatePlayersLeft();
    this.updatePlayersRight();
  }


  updatePlayersLeft() {
    let keyLeft = this.score.playerLeft.key;
    this.playersRight = this.filterPlayer(keyLeft);
    this.scoreIsNotValid = false;
  }

  updatePlayersRight() {
    let keyRight = this.score.playerRight.key;
    this.playersLeft = this.filterPlayer(keyRight);
    this.scoreIsNotValid = false;
  }

  updateScore(){
    this.scoreIsNotValid = false;
  }

  filterPlayer(key){

    if (key===null && (this.currentGroup === undefined || "world" === this.currentGroup.key)){
        //do not filter
        return this.players;
    } else if (key!=null && (this.currentGroup === undefined || "world" === this.currentGroup.key)){
       //filter by player key
       return this.players.map(items => items.filter(p => p.key != key))
    } else if (key!=null && this.currentGroup!=undefined) {
      //filter by player.key and groups
      return this.players.map(items => items.filter(p => p.key != key && p.groupid === this.currentGroup.key))
    } else if (this.currentGroup!=undefined){
      //filter by groups (only)
      return this.players.map(items => items.filter(p => p.groupid === this.currentGroup.key))
    }

  }

  saveScore(){
    if(!this.getMatchInvalid()) {
     this.firebaseService.addScore(this.score);

      //reset score
      this.score.scoreLeft = 0;
      this.score.scoreRight = 0;
      this.scoreIsNotValid = false;
    } else {
      this.scoreIsNotValid = true;
    }
  }


  getMessage() {
    if(this.score.playerLeft.key === null || this.score.playerRight.key === null ){
       return "Please select two players";
    } else if (this.scoreIsNotValid) {
      return "<span>Score is invalid. <br> Valid is '11 : <10' or '10:all with diff 2' or vice versa.</span>";
    }
    return "";
  }

  setDefaultGroup() {
    let group = {
      key: 'world',
      img: './assets/imgs/world.png',
      name: 'World'
    };
    this.events.publish('functionCall:groupSet', group);
    this.currentGroup = group
    //save group locally
    this.storage.set('group', group);
  }

  //read local storage for currentGroup
  getCurrentGroup(){
    this.storage.get('group').then(val => {
      if (null != val || undefined != val) {
        this.currentGroup = val;
        this.events.publish('functionCall:groupSet', val);
      } else {
          //set defaultGroup
          this.setDefaultGroup();
      }
    });
  }

}
