import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { GoalApi } from '../../providers/goal-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { GoalValidator } from './goal-validator'
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';
import { MedicalForm } from '../medicals/medical-form';

@Component({
  selector: 'goal-form',
  templateUrl: 'goal-form.html',
})
export class GoalForm {

  goal: {};

  slideOneForm: FormGroup;
  currentUser: any = { id: 123, goals_setup: true, provider: 'Google', uid: 'indrathota1993', name: 'Indra Mohan Thota', nickname: 'Indra', image: '', email: 'indrathota1993@gmail.com'};
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public goalApi: GoalApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.goal = this.navParams.data;
    console.log(this.goal);
    //this.currentUser = tokenService.currentUserData;

    console.log("inside goal form", this.currentUser);
    this.slideOneForm = formBuilder.group({
      reason: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      frequency: [],
      current_activity: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      delight: ['', Validators.compose([Validators.minLength(10), Validators.required])],
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalForm');

    this.respUtility.trackView("GoalForm");
  }



  save() {
    this.currentUser.goal_setup = true;
    this.respUtility.trackEvent("Goal", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.goal);
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
      if (this.goal["id"]) {
        this.goalApi.updateGoal(this.goal).subscribe(
          goal => {
            // this.currentUser.goal_setup = true;
            this.respUtility.showSuccess('Goal saved successfully.');
            this.navCtrl.pop();
          },
          error => {
            this.respUtility.showFailure(error);
            loader.dismiss();
          },
          () => { loader.dismiss(); }
        );
      } else {
        this.goalApi.createGoal(this.goal).subscribe(
          goal => {
            this.respUtility.showSuccess('Goal saved successfully.');
            if (this.currentUser.medical_setup != true) {
              this.navCtrl.push(MedicalForm);
            }

            this.navCtrl.popToRoot();

          },
          error => {
            this.respUtility.showFailure(error);
            //this.navCtrl.pop();
            loader.dismiss();
          },
          () => { loader.dismiss(); }//loader.dismiss(); }
        );
      }
    }
  }


  getGoalText(name) {
    return this.goalApi.getGoalText(name);
  }

}
