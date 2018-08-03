import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { ScheduleApi } from '../../providers/schedule-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { ScheduleValidator } from './schedule-validator'
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';
import { Workouts } from '../workouts/workouts';
import { LoginProvider } from '../../providers/login-provider';

@Component({
  selector: 'schedule-create',
  templateUrl: 'schedule-create.html',
})
export class ScheduleCreate {

  @ViewChild(Workouts) workouts: Workouts;

  schedule = [
    { label: "Interval", day: 2, duration: 48 },
    { label: "Tempo", day: 4, duration: 60 },
    { label: "Long", day: 6, duration: 90 },
  ];

  fitness_test_id: any;
  newSchedules: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public scheduleApi: ScheduleApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard, private loginProvider: LoginProvider) {

    this.fitness_test_id = this.navParams.data["fitness_test_id"];

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleCreate');
    this.respUtility.trackView("ScheduleCreate");
    // Ensure that the workouts available are shown
    this.workouts.ionViewWillEnter();
    this.workouts.hideNavbar();
  }


  save() {
    this.respUtility.trackEvent("Schedule", "Create", "click");
    //console.log(this.schedule);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    loader.present().then(() => {
      let day_sequence = this.schedule.reduce(function (map, obj) {
        map[obj.day] = obj.label;
        return map;
      }, {});
      this.scheduleApi.generateSchedule(this.fitness_test_id, day_sequence).subscribe(
        schedule => {
          this.respUtility.showSuccess('Schedule saved successfully.');
          this.navCtrl.pop();
          this.respUtility.showSuccess('Schedule will be generated in a few mins. Please check back in 5 mins.');
          //setTimeout(() => {
          this.logout();
          //}, 5000);
          // setTimeout(this.scheduleApi.getSchedules(this.fitness_test_id).subscribe(
          //   schedules => {
          //     console.log("new schedules", schedules);
          //     this.newSchedules = schedules;
          //   }), 5000);
          //setTimeout({logout()},5000);

        },
        error => {
          this.respUtility.showFailure(error);
          loader.dismiss();
        },
        () => { loader.dismiss(); }
      );

    });
  }

  logout() {
    //this.respUtility.trackEvent("User", "Logout", "click");
    this.loginProvider.logout();
  }

}
