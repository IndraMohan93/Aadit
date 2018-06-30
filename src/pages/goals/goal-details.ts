import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { GoalApi } from '../../providers/goal-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'goal-details',
  templateUrl: 'goal-details.html',
})
export class GoalDetails  {

  goal: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public goalApi: GoalApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.goal = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter GoalDetails');
    this.respUtility.trackView("GoalDetails");
    // Always reload the goal from the server for a fresh copy
    this.loadGoal();
  }

  loadGoal() {
    let loader = this.loadingController.create({
      content: 'Loading Goal...'
    });

    loader.present();

    this.goalApi.getGoalDetails(this.goal.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded Goal");
        this.goal = response;
        console.log("Loaded goal");
        console.log(this.goal);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  getGoalText(name) {
    return this.goalApi.getGoalText(name);
  }
}
