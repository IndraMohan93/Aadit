import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Angular2TokenService } from 'angular2-token';
import { Login } from '../login/login';
import { ResponseUtility } from '../../providers/response-utility';
import { RegisterPage } from '../users/register';
import { Config } from '../../providers/config';
import { LoginProvider } from '../../providers/login-provider';
import { Events } from 'ionic-angular';
import { ContactPage } from '../static/contact';
import { Menu } from './menus';
import { HomeEvents } from '../../providers/home-events';
import { GoalForm } from '../goals/goal-form';
import { ScheduleDetails } from '../schedules/schedule-details';
import { MedicalForm } from '../medicals/medical-form';
import { UserForm } from '../users/user-form';
import { FoodLogs } from '../food-logs/food-logs';
import { Goals } from '../goals/goals';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements Menu {

  @ViewChild(ScheduleDetails) scheduleDetails: ScheduleDetails;

  currentUser: any = { id: 123, goals_setup: true, provider: 'Google', uid: 'indrathota1993', name: 'Indra Mohan Thota', nickname: 'Indra', image: '', email: 'indrathota1993@gmail.com'};
  registerCareHome = false;
  message: any;
  schedule: any;
  constructor(public navCtrl: NavController,
    public respUtility: ResponseUtility,
    public tokenService: Angular2TokenService,
    public config: Config,
    public events: Events,
    public homeEvents: HomeEvents,
    private loginProvider: LoginProvider) {

    this.homeEvents.registerMenu(this);
    console.log("this.user", tokenService.currentUserData);
    // this.currentUser = tokenService.currentUserData;
    console.log("this.user", this.scheduleDetails);
    // this.events.subscribe('user:login:success', () => {
    //   console.log("this.user", tokenService.currentUserData);
    //   this.currentUser = tokenService.currentUserData;
    //   console.log("this.user", this.currentUser);
    //   console.log("this.user", this.scheduleDetails);
    //   // Ensure that the scheduleDetails available are shown
    //   if (this.scheduleDetails) {

    //     this.scheduleDetails.loadTodaysSchedule();
    //     this.scheduleDetails.hideNavbar();
    //   }
    //   else {
    //     this.message = "No schedule for today";
    //   }
    // });

  }

  displayMsgs() {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter HomePage ');
    // console.log("in home page", this.currentUser, this.scheduleDetails, this.currentUser.accept_terms, this.currentUser.goals_setup);
    if (this.currentUser && this.scheduleDetails) {
      // Ensure that the scheduleDetails available are shown
      this.scheduleDetails.loadTodaysSchedule();
      this.scheduleDetails.hideNavbar();
    }
    // if (this.currentUser.initial_test_completed == null) {
    // if (this.currentUser.accept_terms != true) {
    //   // The terms have changed - we need to get him to accept the terms again
    //   this.respUtility.showWarning("Our terms have changed. Please read and accept the terms & conditions");
    //   this.edit_profile();
    // }
    if (this.currentUser.goals_setup != true) {
      // The terms have changed - we need to get him to accept the terms again
      //this.currentUser.goals_setup = true;
      this.respUtility.showWarning("Please setup your goals");
      this.setup_goals();
    }



    // }

  }


  // login() {
  //   this.navCtrl.push(Login);
  // }


  logout() {
    this.respUtility.trackEvent("User", "Logout", "click");
    this.loginProvider.logout();
  }

  // register() {
  //   this.navCtrl.push(RegisterPage);
  // }

  // contact() {
  //   this.navCtrl.push(ContactPage);
  // }

  setup_goals() {
    //this.currentUser.goals_setup = true;
    this.navCtrl.push(GoalForm, {})
  }
  edit_profile() {
    //this.currentUser.goals_setup=true;
    this.navCtrl.push(UserForm, this.currentUser);
  }

  setup_medicals() {
    // this.currentUser.medical_setup = true;
    this.navCtrl.push(MedicalForm, {});
  }



  setupFitnessTest() {
    this.navCtrl.push(GoalForm, {})
  }

}
