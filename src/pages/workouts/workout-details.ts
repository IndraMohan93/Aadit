import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { WorkoutApi } from '../../providers/workout-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'workout-details',
  templateUrl: 'workout-details.html',
})
export class WorkoutDetails  {

  workout: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public workoutApi: WorkoutApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.workout = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter WorkoutDetails');
    this.respUtility.trackView("WorkoutDetails");
    // Always reload the workout from the server for a fresh copy
    this.loadWorkout();
  }

  loadWorkout() {
    let loader = this.loadingController.create({
      content: 'Loading Workout...'
    });

    loader.present();

    this.workoutApi.getWorkoutDetails(this.workout.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded Workout");
        this.workout = response;
        console.log("Loaded workout");
        console.log(this.workout);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  deactivateWorkout(workout) {
    this.respUtility.trackEvent("Workout", "Deactivate", "click");
    let loader = this.loadingController.create({
      content: 'Deactivating Workout...'
    });

    workout.active = false;
    loader.present();

    this.workoutApi.updateWorkout(workout).subscribe(
      response => {
        this.respUtility.showSuccess("Deactivated Workout");
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  confirmDeactivate(workout) {
    this.respUtility.confirmAction(this.deactivateWorkout.bind(this), workout, "Deactivate Workout. Confirm?");
  }

}
