import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { FoodLogApi } from '../../providers/food-log-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';
import moment from 'moment';

@Component({
  selector: 'food-log-form',
  templateUrl: 'food-log-form.html',
})
export class FoodLogForm {

  food_log: {};

  slideOneForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public food_logApi: FoodLogApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.food_log = this.navParams.data;
    this.food_log["intake_date"] = moment(this.food_log["intake_date"]).format();

    console.log(this.food_log);  

    this.slideOneForm = formBuilder.group({
      meal: ['', Validators.compose([Validators.maxLength(15), Validators.required])],
      intake_date: ['', Validators.compose([Validators.required])],
      details: ['', Validators.compose([Validators.required])],
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FoodLogForm');
    this.respUtility.trackView("FoodLogForm");
  }


  save() {
    this.respUtility.trackEvent("FoodLog", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.food_log);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });

    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      loader.present();
      
      this.food_log["intake_date"] = moment(this.food_log["intake_date"]).toISOString();

      if (this.food_log["id"]) {
        this.food_logApi.updateFoodLog(this.food_log).subscribe(
          food_log => {
            this.respUtility.showSuccess('FoodLog saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.food_logApi.createFoodLog(this.food_log).subscribe(
          food_log => {
            this.respUtility.showSuccess('FoodLog saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      }
    }
  }

}
