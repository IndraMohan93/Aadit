import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { StressTestApi } from '../../providers/stress-test-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';

@Component({
  selector: 'stress-test-form',
  templateUrl: 'stress-test-form.html',
})
export class StressTestForm {

  stress_test: {};
  questions: any;
  slideOneForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public stress_testApi: StressTestApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.stress_test = this.navParams.data;
    console.log(this.stress_test);  

    this.slideOneForm = formBuilder.group({

      unexpected_upset: ['', Validators.compose([Validators.required])], 
      unable_to_control:['', Validators.compose([Validators.required])],  
      nervous: ['', Validators.compose([Validators.required])], 
      confident: ['', Validators.compose([Validators.required])],  
      things_going_right: ['', Validators.compose([Validators.required])], 
      cannot_cope: ['', Validators.compose([Validators.required])],  
      control_irritation: ['', Validators.compose([Validators.required])], 
      top_of_things: ['', Validators.compose([Validators.required])], 
      anger: ['', Validators.compose([Validators.required])],  
      difficulties_piling: ['', Validators.compose([Validators.required])], 

    });


    this.questions = Object.keys(this.stress_testApi.getAllText());
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad StressTestForm');
    this.respUtility.trackView("StressTestForm");
  }


  save() {
    this.respUtility.trackEvent("StressTest", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.stress_test);
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
      if (this.stress_test["id"]) {
        this.stress_testApi.updateStressTest(this.stress_test).subscribe(
          stress_test => {
            this.respUtility.showSuccess('StressTest saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.stress_testApi.createStressTest(this.stress_test).subscribe(
          stress_test => {
            this.respUtility.showSuccess('StressTest saved successfully.');
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


  getStressTestText(name) {
    return this.stress_testApi.getStressTestText(name);
  }

  getStressColor() {
  }
  
}
