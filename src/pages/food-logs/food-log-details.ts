import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FoodLogApi } from '../../providers/food-log-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'food-log-details',
  templateUrl: 'food-log-details.html',
})
export class FoodLogDetails  {

  food_log: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public food_logApi: FoodLogApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.food_log = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter FoodLogDetails');
    this.respUtility.trackView("FoodLogDetails");
    // Always reload the food_log from the server for a fresh copy
    this.loadFoodLog();
  }

  loadFoodLog() {
    let loader = this.loadingController.create({
      content: 'Loading FoodLog...'
    });

    loader.present();

    this.food_logApi.getFoodLogDetails(this.food_log.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded FoodLog");
        this.food_log = response;
        console.log("Loaded food_log");
        console.log(this.food_log);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

}
