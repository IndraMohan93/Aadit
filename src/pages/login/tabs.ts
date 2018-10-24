import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Angular2TokenService } from 'angular2-token';
//import { HomePage } from './home';
import { FoodLogs } from '../food-logs/food-logs';
import { Schedules } from '../schedules/schedules';
import { ResponseUtility } from '../../providers/response-utility';
import { Login } from './login';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    homeRoot = Login;
    foodLogRoot = FoodLogs;
    scheduleRoot = Schedules;
    newUser: boolean = false;
    currentUser: any = { id: 123, goals_setup: true, provider: 'Google', uid: 'indrathota1993', name: 'Indra Mohan Thota', nickname: 'Indra', image: '', email: 'indrathota1993@gmail.com'};
    schedule: boolean;

    constructor(public respUtility: ResponseUtility,
        public events: Events,
        public tokenService: Angular2TokenService) {
        this.currentUser = tokenService.currentUserData;
        this.events.subscribe('user:login:success', () => {
            this.currentUser = tokenService.currentUserData;
            if (this.currentUser.initial_test_completed != true) {
                this.newUser = true;

            }
            this.schedule = false;
        });
        this.events.subscribe('user:logout:success', () => {
            console.log("Hiding tabs as user logged out");
            this.currentUser = null;
        });
    }
}