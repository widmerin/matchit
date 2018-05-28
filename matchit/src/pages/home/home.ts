import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
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
  scoreMax = 15;
  playerLeft: any;
  playerRight: any;
  players: Observable<any[]>;
  playersLeft: Observable<any[]>;
  playersRight: Observable<any[]>;
  score: any;
  groups: Observable<any[]>;
  currentGroup: any = {
      key: 'world',
      img: './assets/imgs/world.png',
      name: 'World'
  };

  constructor(public navCtrl: NavController, public firebaseService: FirebaseServiceProvider, private storage: Storage, public events: Events) {
    
    this.groups = this.firebaseService.getGroups();
    
    //get currentGroup from local storage
    this.getCurrentGroup();
    
    for (let index = this.scoreMax; index >= this.scoreMin; index--) {
      this.scoreRange.push(index);
    }
    
    this.setupPlayers();

    this.score = {
      datetime: null,
      scoreLeft: null,
      playerLeft: this.playerLeft,
      scoreRight: null,
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

  getMatchInvalid() {
    //return invalid
    return !(// valid conditions:
      //not null 
      (this.score.scoreRight !== null && this.score.scoreLeft !== null
        && this.score.playerLeft.key !== null && this.score.playerRight.key !== null) &&
      //valid scores
      ((this.score.scoreRight < 15 && this.score.scoreRight > 0 && this.score.scoreLeft === 15)
        || (this.score.scoreRight === 15 && this.score.scoreLeft < 15 && this.score.scoreLeft > 0)
        || (this.score.scoreRight === 9 && this.score.scoreLeft === 0)
        || (this.score.scoreRight === 0 && this.score.scoreLeft === 9)
        )
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
  }

  updatePlayersRight() {
    let keyRight = this.score.playerRight.key;
    this.playersLeft = this.filterPlayer(keyRight);      
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
      this.score.scoreLeft = null;
      this.score.scoreRight = null;
    }

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
    this.storage.ready().then( () => {
      var val = this.storage.get('group');
      if(null!==val && undefined!==val) {
        this.currentGroup = val;
      }else{
        //set defaultGroup
        this.setDefaultGroup();
      }
    });
  }

  gotoGroups() {
    //TODO: navigate to groups
  }

}
