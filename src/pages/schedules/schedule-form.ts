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

@Component({
  selector: 'schedule-form',
  templateUrl: 'schedule-form.html',
})
export class ScheduleForm {

  schedule: {};

  slideOneForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public scheduleApi: ScheduleApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.schedule = this.navParams.data;
    console.log(this.schedule);

    this.slideOneForm = formBuilder.group({
      rating: ['', Validators.compose([Validators.required])],
      comments: [],
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleForm');
    this.respUtility.trackView("ScheduleForm");
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
      loader.present().then(() => {
        if (this.schedule["id"]) {
          this.scheduleApi.updateSchedule(this.schedule).subscribe(
            schedule => {
              this.respUtility.showSuccess('Schedule saved successfully.');
              this.navCtrl.pop();
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
              this.navCtrl.pop();
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
    if (val != -1) {
      setTimeout(() => {
        this.save();
      }, 1000);
    }
  }
}
