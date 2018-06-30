import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { MedicalApi } from '../../providers/medical-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { MedicalValidator } from './medical-validator'
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';

@Component({
  selector: 'medical-form',
  templateUrl: 'medical-form.html',
})
export class MedicalForm {

  medical: {};

  slideOneForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public medicalApi: MedicalApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.medical = this.navParams.data;
    console.log(`this.navParams.data`, this.navParams.data);
    console.log(this.medical);

    this.slideOneForm = formBuilder.group({
      last_medical_checkup: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      specific_issue: [''],
      q1: [''],
      q2: [''],
      q3: [''],
      q4: [''],
      q5: [''],
      q6: [''],
      q7: [''],
      q8: [''],
      q9: [''],
      q10: [''],
      q11: [''],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalForm');
    this.respUtility.trackView("MedicalForm");

    if (this.medical == null || this.medical["load_from_server"] == true) {
      // Grab the medicals for the currently logged in user

      let loader = this.loadingController.create({
        content: 'Loading Medicals..'
      });

      loader.present();

      let currentUser = this.tokenService.currentUserData;
      this.medicalApi.getMedicals().subscribe(
        medicals => {
          this.medical = medicals[0];
          console.log("Loaded medicals");
          console.log(Object.prototype.toString.call(this.medical));
        },
        error => { this.respUtility.showFailure(error); loader.dismiss(); },
        () => { loader.dismiss(); }
      );

    } else {
      // Ensure that the boolean properties are not undefined
      let booleanParams = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"];
      for (var i in booleanParams) {
        let property = booleanParams[i];
        if (this.medical[property] === undefined) {
          this.medical[property] = false;
        }
      }
    }


  }


  save() {
    
    this.respUtility.trackEvent("Medical", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.medical);
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
      if (this.medical["id"]) {
        this.medicalApi.updateMedical(this.medical).subscribe(
          medical => {
            this.respUtility.showSuccess('Medical saved successfully.');
            this.navCtrl.push(TermsPage);
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.medicalApi.createMedical(this.medical).subscribe(
          medical => {
            this.respUtility.showSuccess('Medical saved successfully.');
            this.navCtrl.push(TermsPage);
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


  getMedicalText(name) {
    return this.medicalApi.getMedicalText(name);
  }

  uncheckAllOthers() {
    if (this.medical["q11"] == true) {
      this.medical["q1"] = false;
      this.medical["q2"] = false;
      this.medical["q3"] = false;
      this.medical["q4"] = false;
      this.medical["q5"] = false;
      this.medical["q6"] = false;
      this.medical["q7"] = false;
      this.medical["q8"] = false;
      this.medical["q9"] = false;
      this.medical["q10"] = false;
    }
  }
}
