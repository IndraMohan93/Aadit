import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class FoodLogApi {

  private base_url = "food_logs";
  private remoteEndpoint;
  food_logs = [];
  food_log = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('FoodLogApi Provider Created');
  }

  getFoodLogs(day) {
    
    let endpoint = `${this.base_url}.json?day=${day}`;
    return this.tokenService.get(endpoint).map(response=>{
      this.food_logs = response.json();
      return this.food_logs;      
    })
  }

  getFoodLogDetails(food_log_id) {
    return this.tokenService.get(`${this.base_url}/${food_log_id}.json`).map(response=>{
      this.food_log = response.json();
      return this.food_log;
    })
  }

  createFoodLog(food_log) {
    return this.tokenService.post(`${this.base_url}.json`, food_log).map(response=>{
      this.food_log = response.json();
      return this.food_log;
      //return response.status;
    })
  }

  updateFoodLog(food_log) {
    console.log(`FoodLogApi: Updating food_log`)
    console.log(food_log);
    return this.tokenService.put(`${this.base_url}/${food_log.id}.json`, food_log).map(response=>{
      this.food_log = response.json();
      return this.food_log;
    })
  }

  deleteFoodLog(food_log) {
    return this.tokenService.delete(`${this.base_url}/${food_log.id}.json`).map(response=>{
      return response.status;
    })
  }

}
