import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FitnessTestApi } from '../../providers/fitness-test-api';
import { ResponseUtility } from '../../providers/response-utility';
import {Workouts} from '../workouts/workouts';
import {Schedules} from '../schedules/schedules';
import * as _ from 'lodash';
import { CardioProfiles } from '../cardio-profile/cardio-profiles';

@Component({
  selector: 'page-fitness-test-details',
  templateUrl: 'fitness-test-details.html',
})
export class FitnessTestDetails  {

  fitness_test: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public fitness_testApi: FitnessTestApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.fitness_test = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter FitnessTestDetails');
    this.respUtility.trackView("FitnessTestDetails");
    // Always reload the fitness_test from the server for a fresh copy
    this.loadFitnessTest();
  }

  loadFitnessTest() {
    let loader = this.loadingController.create({
      content: 'Loading FitnessTest...'
    });

    loader.present();

    this.fitness_testApi.getFitnessTestDetails(this.fitness_test.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded FitnessTest");
        this.fitness_test = response;
        console.log("Loaded fitness_test");
        console.log(this.fitness_test);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  deactivateFitnessTest(fitness_test) {
    this.respUtility.trackEvent("FitnessTest", "Deactivate", "click");
    let loader = this.loadingController.create({
      content: 'Deactivating FitnessTest...'
    });

    fitness_test.active = false;
    loader.present();

    this.fitness_testApi.updateFitnessTest(fitness_test).subscribe(
      response => {
        this.respUtility.showSuccess("Deactivated FitnessTest");
        this.navCtrl.pop();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  confirmDeactivate(fitness_test) {
    this.respUtility.confirmAction(this.deactivateFitnessTest.bind(this), fitness_test, "Deactivate FitnessTest. Confirm?");
  }

  showWorkouts() {
    this.respUtility.trackEvent("Workout", "Details", "click");
    this.navCtrl.push(Workouts, {fitness_test_id: this.fitness_test.id});
  }

  showSchedules() {
      this.respUtility.trackEvent("Schedule", "Details", "click");
      this.navCtrl.push(Schedules, {fitness_test_id: this.fitness_test.id});
  }

  showCardioProfile() {
    this.respUtility.trackEvent("CardioProfiles", "Details", "click");
    this.navCtrl.push(CardioProfiles, this.fitness_test.cardio_profiles);
}

}
