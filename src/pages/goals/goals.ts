import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { GoalForm } from './goal-form';
import { GoalApi } from '../../providers/goal-api';

@Component({
  selector: 'goals',
  templateUrl: 'goals.html',
})
export class Goals {

  goals: any;
  goal: any;

  goalHistory: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public goalApi: GoalApi,
    public respUtility: ResponseUtility) {
  }

  ionViewWillEnter() {

    this.goalHistory = false;
    console.log('ionViewWillEnter Goals');
    this.respUtility.trackView("Goals");
    let loader = this.loadingController.create({
      content: 'Loading Goals..'
    });

    loader.present();

    this.goalApi.getGoals().subscribe(
      goals => {
        this.goals = goals;
        this.goalHistory = true;;
        console.log("Loaded goals");
        console.log(goals);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  createGoals() {
    this.navCtrl.push(GoalForm);
  }

  getGoalDetails(goal) {
    this.respUtility.trackEvent("Goal", "Form", "click");
    this.navCtrl.push(GoalForm, goal);
  }

  getGoalText(name) {
    return this.goalApi.getGoalText(name);
  }
}
