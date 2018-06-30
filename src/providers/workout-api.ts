import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class WorkoutApi {

  private base_url = "workouts";
  private remoteEndpoint;
  workouts = [];
  workout = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('WorkoutApi Provider Created');
  }

  getWorkouts(fitness_test_id) {
    
    let endpoint = `${this.base_url}.json`;
    if(fitness_test_id) {
      endpoint = `${this.base_url}.json?fitness_test_id=${fitness_test_id}`;
    }
    return this.tokenService.get(endpoint).map(response=>{
      this.workouts = response.json();
      return this.workouts;      
    })
  }

  getWorkoutDetails(workout_id) {
    return this.tokenService.get(`${this.base_url}/${workout_id}.json`).map(response=>{
      this.workout = response.json();
      return this.workout;
    })
  }

  createWorkout(workout) {
    return this.tokenService.post(`${this.base_url}.json`, workout).map(response=>{
      this.workout = response.json();
      return this.workout;
      //return response.status;
    })
  }

  updateWorkout(workout) {
    console.log(`WorkoutApi: Updating workout`)
    console.log(workout);
    return this.tokenService.put(`${this.base_url}/${workout.id}.json`, workout).map(response=>{
      this.workout = response.json();
      return this.workout;
    })
  }

  deleteWorkout(workout) {
    return this.tokenService.delete(`${this.base_url}/${workout.id}.json`).map(response=>{
      return response.status;
    })
  }

}
