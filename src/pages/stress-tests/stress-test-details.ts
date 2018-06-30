import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { StressTestApi } from '../../providers/stress-test-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'stress-test-details',
  templateUrl: 'stress-test-details.html',
})
export class StressTestDetails  {

  stress_test: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public stress_testApi: StressTestApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.stress_test = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter StressTestDetails');
    this.respUtility.trackView("StressTestDetails");
    // Always reload the stress_test from the server for a fresh copy
    this.loadStressTest();
  }

  loadStressTest() {
    let loader = this.loadingController.create({
      content: 'Loading StressTest...'
    });

    loader.present();

    this.stress_testApi.getStressTestDetails(this.stress_test.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded StressTest");
        this.stress_test = response;
        console.log("Loaded stress_test");
        console.log(this.stress_test);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  getStressTestText(name) {
    return this.stress_testApi.getStressTestText(name);
  }
}
