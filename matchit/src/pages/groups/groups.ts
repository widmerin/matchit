import { Component, ViewChild } from '@angular/core';
import { NavController, Content, ModalController } from 'ionic-angular';
import { ItemSliding } from 'ionic-angular';
import { GroupsModalPage } from './modal-page';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html'
})
export class GroupsPage {

  @ViewChild(Content) content: Content;

  groups: Observable<any[]>;
  selectedGroup: any = {
    key: 'world',
    img: './assets/imgs/world.png',
    name: 'World'
  };

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public firebaseService: FirebaseServiceProvider, private storage: Storage, public events: Events) {

    this.groups = this.firebaseService.getGroups();

    //read local storage for selectedGroup
    this.storage.ready().then(() => {
      var val = this.storage.get('group');
      if (null != val || undefined != val) {
        this.selectedGroup = val;
      } else {
        this.selectedGroup = { key: "world" };
      }
    });

    events.subscribe('functionCall:groupSet', (group) => {
      this.selectedGroup = group;
    });


  }


  openModal(group) {

    let myModal = this.modalCtrl.create(GroupsModalPage, group);

    myModal.onDidDismiss(group => {
      if (group && group !== 'null' && group !== 'undefined') {
        console.log("onDidDismiss: " + group.name);
        if (group.key != null) {
          //Update group
          this.firebaseService.updateGroup(group.key, group);
        } else {
          //Add new group
          this.firebaseService.addGroup(group);
        }
      }
    });
    myModal.present();

  }

  setDefaultGroup() {
    let group = {
      key: 'world',
      img: './assets/imgs/world.png',
      name: 'World'
    };
    this.events.publish('functionCall:groupSet', group);
    this.selectedGroup = group
    //save group locally
    this.storage.set('group', group);
  }


  setGroup(group) {
    this.events.publish('functionCall:groupSet', group);
    this.selectedGroup = group
    //save group locally
    this.storage.set('group', group);
  }

  deleteItem(item, slidingItem: ItemSliding) {
    this.firebaseService.deleteGroup(item.key);
    this.groups = this.firebaseService.getGroups();
    slidingItem.close();
  }
}
