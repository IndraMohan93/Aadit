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
import { FoodLogs } from '../food-logs/food-logs';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements Menu {

  @ViewChild(ScheduleDetails) scheduleDetails: ScheduleDetails;

  currentUser: any;
  registerCareHome = false;
  message: any;

  constructor(public navCtrl: NavController,
    public respUtility: ResponseUtility,
    public tokenService: Angular2TokenService,
    public config: Config,
    public events: Events,
    public homeEvents: HomeEvents,
    private loginProvider: LoginProvider) {

    this.homeEvents.registerMenu(this);
    console.log("this.user", tokenService.currentUserData);
    this.currentUser = tokenService.currentUserData;
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
    if (this.currentUser && this.scheduleDetails) {
      // Ensure that the scheduleDetails available are shown
      this.scheduleDetails.loadTodaysSchedule();
      this.scheduleDetails.hideNavbar();
    };

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

  // setupGoals() {
  //   this.navCtrl.push(GoalForm, {})
  // }

  // setupFitnessTest() {
  //   this.navCtrl.push(GoalForm, {})
  // }

}
