import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class StressTestApi {

  public stress_test_text = {
    "unexpected_upset": "How often have you been upset because of something that happened unexpectedly?", 
    "unable_to_control": "How often have you felt that you were unable to control the important things in your life?", 
    "nervous": "How often have you felt nervous and 'stressed'?", 
    "confident": "How often have you felt confident about your ability to handle your personal problems?", 
    "things_going_right": "How often have you felt that things were going your way?", 
    "cannot_cope": "How often have you found that you could not cope with all the things that you had to do?", 
    "control_irritation": "How often have you been able to control irritations in your life?", 
    "top_of_things": "How often have you felt that you were on top of things?", 
    "anger": "How often have you been angered because of things that were outside of your control?", 
    "difficulties_piling": "How often have you felt difficulties were piling up so high that you could not overcome them?"
  }

  private base_url = "stress_tests";
  private remoteEndpoint;
  stress_tests = [];
  stress_test = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('StressTestApi Provider Created');
  }

  getStressTests() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.stress_tests = response.json();
      return this.stress_tests;      
    })
  }

  getStressTestDetails(stress_test_id) {
    return this.tokenService.get(`${this.base_url}/${stress_test_id}.json`).map(response=>{
      this.stress_test = response.json();
      return this.stress_test;
    })
  }

  createStressTest(stress_test) {
    return this.tokenService.post(`${this.base_url}.json`, stress_test).map(response=>{
      this.stress_test = response.json();
      return this.stress_test;
      //return response.status;
    })
  }

  updateStressTest(stress_test) {
    console.log(`StressTestApi: Updating stress_test`)
    console.log(stress_test);
    return this.tokenService.put(`${this.base_url}/${stress_test.id}.json`, stress_test).map(response=>{
      this.stress_test = response.json();
      return this.stress_test;
    })
  }

  deleteStressTest(stress_test) {
    return this.tokenService.delete(`${this.base_url}/${stress_test.id}.json`).map(response=>{
      return response.status;
    })
  }

  getStressTestText(name) {
    return this.stress_test_text[name];
  }

  getAllText() {
    return this.stress_test_text;
  }
}
