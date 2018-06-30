import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { UserForm } from './user-form';
import { UserDetails } from './user-details';
import { UserApi } from '../../providers/user-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'page-user-tabs',
  templateUrl: 'user-tabs.html',
})
export class UserTabs  {

  user: any;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root = UserDetails;
  tab2Root: any; 
  tab3Root: any;
  tabIndex = 0;
  params = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userApi: UserApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.user = this.navParams.data;
    if(this.user.role == "Admin") {
    } else {
    }

    this.params = {showNavBar: false, user: this.user};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserTabs');
  }

  tabClick(event:MouseEvent) {
    console.log("UserTabs: tabClick", event);
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
