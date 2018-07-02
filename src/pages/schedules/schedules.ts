import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { ScheduleForm } from './schedule-form';
import { ScheduleApi } from '../../providers/schedule-api';
import { ScheduleDetails } from './schedule-details';
import { ScheduleCreate } from './schedule-create.';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import {
  CalendarComponentOptions
} from 'ion2-calendar'

@Component({
  selector: 'schedules',
  templateUrl: 'schedules.html',
})
export class Schedules {

  schedules: any;
  schedule: any;
  fitness_test_id: any = null;
  Data: any;
  date: string = new Date().toISOString();
  options: CalendarComponentOptions;
  checkStatus: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public scheduleApi: ScheduleApi,
    public respUtility: ResponseUtility,
    public modalCtrl: ModalController, private alertCtrl: AlertController) {

    if (this.navParams.data["fitness_test_id"] !== null) {
      this.fitness_test_id = this.navParams.data["fitness_test_id"];
    }

  }

  ionViewWillEnter() {
    this.checkStatus = true;
    console.log('ionViewWillEnter Schedules');
    this.respUtility.trackView("Schedules");
    let loader = this.loadingController.create({
      content: 'Loading Schedules..'
    });

    loader.present();

    this.scheduleApi.getSchedules(this.fitness_test_id).subscribe(
      schedules => {
        this.schedules = schedules;
        if (!!this.schedules) {
          console.log(this.schedules)
          this.options = {
            from: new Date(!!this.schedules[0]["scheduled_date"] ? this.schedules[0].scheduled_date : this.date)
          }
          this.schedule = this.schedules[1]
        }
        console.log("Loaded schedules");
        console.log(schedules);
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );
  }

  onChange($event) {
    // console.log("this.schedules", this.schedules[6]);
    // console.log("$event", $event);
    this.checkStatus = true;
    this.schedules.filter((schedule) => {
      if ($event == schedule.scheduled_date) {
        console.log("matched", schedule);
        this.schedule = schedule;
      }
    });

    if ($event > this.schedules[6].scheduled_date) {
      this.checkStatus = false;
      // let alert = this.alertCtrl.create({
      //   title: 'Not Scheduled',
      //   buttons: ['Dismiss']
      // });
      // alert.present();
    }

  }

  rateSchedule(schedule) {
    this.respUtility.trackEvent("Schedule", "Form", "click");
    this.navCtrl.push(ScheduleForm, schedule);
  }

  createSchedule() {
    console.log("ScheduleCreate called");
    this.navCtrl.push(ScheduleCreate, {});
  }

}