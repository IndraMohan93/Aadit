import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, Content } from 'ionic-angular';
import { ScheduleApi } from '../../providers/schedule-api';
import { ResponseUtility } from '../../providers/response-utility';

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


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public scheduleApi: ScheduleApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {
    this.schedule = this.navParams.data;

  }

  ionViewWillEnter() {
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
}
