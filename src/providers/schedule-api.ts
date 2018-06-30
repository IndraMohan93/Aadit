import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class ScheduleApi {

  private base_url = "schedules";
  private remoteEndpoint;
  schedules = [];
  schedule = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('ScheduleApi Provider Created');
  }

  getSchedules(fitness_test_id) {
    let endpoint = `${this.base_url}.json`;
    if(fitness_test_id) {
      endpoint = `${this.base_url}.json?fitness_test_id=${fitness_test_id}`;
    }
    return this.tokenService.get(endpoint).map(response=>{
      this.schedules = response.json();
      return this.schedules;      
    })
  }

  getScheduleDetails(schedule_id) {
    return this.tokenService.get(`${this.base_url}/${schedule_id}.json`).map(response=>{
      this.schedule = response.json();
      return this.schedule;
    })
  }

  getTodaysScheduleDetails() {
    return this.tokenService.get(`${this.base_url}/todays_schedule.json`).map(response=>{
      this.schedule = response.json();
      return this.schedule;
    })
  }

  createSchedule(schedule) {
    return this.tokenService.post(`${this.base_url}.json`, schedule).map(response=>{
      this.schedule = response.json();
      return this.schedule;
      //return response.status;
    })
  }

  generateSchedule(fitness_test_id, day_sequence) {
    let endpoint = `${this.base_url}/generate_schedule.json`
    if(fitness_test_id) {
      endpoint = `${this.base_url}/generate_schedule.json?fitness_test_id=${fitness_test_id}`;
    }
    return this.tokenService.post(endpoint, {day_sequence: day_sequence}).map(response=>{
      this.schedule = response.json();
      return this.schedule;
      //return response.status;
    })
  }

  updateSchedule(schedule) {
    console.log(`ScheduleApi: Updating schedule`)
    console.log(schedule);
    return this.tokenService.put(`${this.base_url}/${schedule.id}.json`, schedule).map(response=>{
      this.schedule = response.json();
      return this.schedule;
    })
  }

  deleteSchedule(schedule) {
    return this.tokenService.delete(`${this.base_url}/${schedule.id}.json`).map(response=>{
      return response.status;
    })
  }

}
