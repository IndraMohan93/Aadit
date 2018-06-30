import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class StrengthWorkoutApi {

  private base_url = "strength_workouts";
  private remoteEndpoint;
  strength_workouts = [];
  strength_workout = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('StrengthWorkoutApi Provider Created');
  }

  getStrengthWorkouts(fitness_test_id) {
    
    let endpoint = `${this.base_url}.json`;
    if(fitness_test_id) {
      endpoint = `${this.base_url}.json?fitness_test_id=${fitness_test_id}`;
    }
    return this.tokenService.get(endpoint).map(response=>{
      this.strength_workouts = response.json();
      return this.strength_workouts;      
    })
  }

  getStrengthWorkoutDetails(strength_workout_id) {
    return this.tokenService.get(`${this.base_url}/${strength_workout_id}.json`).map(response=>{
      this.strength_workout = response.json();
      return this.strength_workout;
    })
  }

  createStrengthWorkout(strength_workout) {
    return this.tokenService.post(`${this.base_url}.json`, strength_workout).map(response=>{
      this.strength_workout = response.json();
      return this.strength_workout;
      //return response.status;
    })
  }

  updateStrengthWorkout(strength_workout) {
    console.log(`StrengthWorkoutApi: Updating strength_workout`)
    console.log(strength_workout);
    return this.tokenService.put(`${this.base_url}/${strength_workout.id}.json`, strength_workout).map(response=>{
      this.strength_workout = response.json();
      return this.strength_workout;
    })
  }

  deleteStrengthWorkout(strength_workout) {
    return this.tokenService.delete(`${this.base_url}/${strength_workout.id}.json`).map(response=>{
      return response.status;
    })
  }

}
