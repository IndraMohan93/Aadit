import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Angular2TokenService } from 'angular2-token';
import { HomePage } from './home';
import { FoodLogs } from '../food-logs/food-logs';
import { Schedules } from '../schedules/schedules';
import { ResponseUtility } from '../../providers/response-utility';
import { Login } from './../login/login';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    homeRoot = HomePage;
    foodLogRoot = FoodLogs;
    scheduleRoot = Schedules;
    loginRoot = Login;
    currentUser: any;
    newUser: boolean = true;
    schedule: boolean;

    constructor(public respUtility: ResponseUtility,
        public events: Events,
        public tokenService: Angular2TokenService) {
        this.currentUser = tokenService.currentUserData;
        this.events.subscribe('user:login:success', () => {
            this.currentUser = tokenService.currentUserData;
            // if (this.currentUser.initial_test_completed != true) {
            //     this.newUser = true;

            // }
            this.schedule = this.currentUser.schedule;
        });
        this.events.subscribe('user:logout:success', () => {
            console.log("Hiding tabs as user logged out");
            this.currentUser = null;
        });
    }
}