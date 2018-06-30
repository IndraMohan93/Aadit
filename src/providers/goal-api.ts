import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class GoalApi {

  goalText = {
    "REASON": "The reason I want to sign up for the program is",
    "DELIGHT": "In six months, I will be delighted if",
    "FREQ": "My current frequency of physical activity is",
    "CURRENT_ACTIVITY": "Briefly describe what you currently do for physical activity"
  }

  private base_url = "goals";
  private remoteEndpoint;
  goals = [];
  goal = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('GoalApi Provider Created');
  }

  getGoals() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.goals = response.json();
      return this.goals;      
    })
  }

  getGoalDetails(goal_id) {
    return this.tokenService.get(`${this.base_url}/${goal_id}.json`).map(response=>{
      this.goal = response.json();
      return this.goal;
    })
  }

  createGoal(goal) {
    return this.tokenService.post(`${this.base_url}.json`, goal).map(response=>{
      this.goal = response.json();
      return this.goal;
      //return response.status;
    })
  }

  updateGoal(goal) {
    console.log(`GoalApi: Updating goal`)
    console.log(goal);
    return this.tokenService.put(`${this.base_url}/${goal.id}.json`, goal).map(response=>{
      this.goal = response.json();
      return this.goal;
    })
  }

  deleteGoal(goal) {
    return this.tokenService.delete(`${this.base_url}/${goal.id}.json`).map(response=>{
      return response.status;
    })
  }

  getGoalText(name) {
    return this.goalText[name];
  }
}
