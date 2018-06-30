import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { StressTestForm } from './stress-test-form';
import { StressTestApi } from '../../providers/stress-test-api';

@Component({
  selector: 'stress-tests',
  templateUrl: 'stress-tests.html',
})
export class StressTests {

  stress_tests: any;
  stress_test: any;

  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public stress_testApi: StressTestApi,
    public respUtility: ResponseUtility) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter StressTests');
    this.respUtility.trackView("StressTests");
    let loader = this.loadingController.create({
      content: 'Loading StressTests..'
    });

    loader.present();

    this.stress_testApi.getStressTests().subscribe(
      stress_tests => {
        this.stress_tests = stress_tests;
        console.log("Loaded stress_tests");
        console.log(stress_tests);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  getStressTestDetails(stress_test) {
    this.respUtility.trackEvent("StressTest", "Form", "click");
    this.navCtrl.push(StressTestForm, stress_test);
  }

  newStressTestDetails() {
    this.respUtility.trackEvent("StressTest", "New", "click");
    this.navCtrl.push(StressTestForm, {});
  }


  getStressTestText(name) {
    return this.stress_testApi.getStressTestText(name);
  }
}
