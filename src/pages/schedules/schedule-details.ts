import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Content } from 'ionic-angular';
import { ScheduleApi } from '../../providers/schedule-api';
import { ResponseUtility } from '../../providers/response-utility';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ScheduleForm } from './schedule-form';

@Component({
  selector: 'schedule-details',
  templateUrl: 'schedule-details.html',
})
export class ScheduleDetails {

  @ViewChild("schedule_content") content: Content;
  public showNavbar: boolean = false;
  schedule: any = {};

  //schedule: {};

  slideOneForm: FormGroup;

  submitAttempt: boolean = false;
  showSmileys: boolean;
  NotComplete: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public scheduleApi: ScheduleApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {
    this.schedule = this.navParams.data;
    // this.schedule = this.navParams.data;
    console.log(this.schedule);

    this.slideOneForm = formBuilder.group({
      rating: ['', Validators.compose([Validators.required])],
      comments: [],
    });


  }

  ionViewWillEnter() {
    //this.submitAttempt = false;
    this.showSmileys = false;
    console.log('ionViewWillEnter ScheduleDetails');
    this.respUtility.trackView("ScheduleDetails");
  }

  loadSchedule() {
    let loader = this.loadingController.create({
      content: 'Loading Schedule...'
    });

    loader.present();

    this.scheduleApi.getScheduleDetails(this.schedule.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded Schedule");
        this.schedule = response;
        console.log("Loaded schedule");
        console.log(this.schedule);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }



  loadTodaysSchedule() {
    let loader = this.loadingController.create({
      content: 'Loading Schedule...'
    });

    loader.present();

    this.scheduleApi.getTodaysScheduleDetails().subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded Schedule");
        this.schedule = response;
        console.log("Loaded todays schedule");
        console.log(this.schedule);
        this.content.resize();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }


  rateSchedule(schedule) {
    this.respUtility.trackEvent("Schedule", "Form", "click");
    this.navCtrl.push(ScheduleForm, schedule);
  }

  public hideNavbar(): void {
    this.showNavbar = false;
    // You should resize the content to use the space left by the navbar
    this.content.resize();
  }

  feedback() {
    this.showSmileys = true;
  }

  save() {
    this.respUtility.trackEvent("Schedule", "Save", "click");
    this.submitAttempt = true;

    //console.log(this.schedule);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      this.showSmileys = false;
      this.NotComplete = true;
      loader.present().then(() => {
        if (this.schedule["id"]) {
          this.scheduleApi.updateSchedule(this.schedule).subscribe(
            schedule => {
              this.respUtility.showSuccess('Schedule saved successfully.');
              this.navCtrl.popToRoot();
            },
            error => {
              this.respUtility.showFailure(error);
              loader.dismiss();
            },
            () => { loader.dismiss(); }
          );
        } else {
          this.scheduleApi.createSchedule(this.schedule).subscribe(
            schedule => {
              this.respUtility.showSuccess('Schedule saved successfully.');
              this.navCtrl.popToRoot();
            },
            error => {
              this.respUtility.showFailure(error);
              loader.dismiss();
            },
            () => { loader.dismiss(); }
          );
        }
      });
    }
  }

  setRating(val) {
    this.slideOneForm.controls['rating'].setValue(val);
    this.schedule["rating"] = val;
    console.log(`Set rating to ${val}`);
    if (val != -1 || val == -1) { //val != -1 
      setTimeout(() => {
        this.save();
      }, 1000);
    }
  }
}
