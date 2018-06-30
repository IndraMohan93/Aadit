import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class FitnessTestApi {
 private base_url_target = "targets";
  private base_url = "fitness_tests";
  private remoteEndpoint;
  fitness_tests = [];
  fitness_test = {};
  targets=[];
  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('FitnessTestApi Provider Created');
  }

  getFitnessTests() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.fitness_tests = response.json();
      return this.fitness_tests;      
    })
  }

  getFitnessTestDetails(fitness_test_id) {
    return this.tokenService.get(`${this.base_url}/${fitness_test_id}.json`).map(response=>{
      this.fitness_test = response.json();
      return this.fitness_test;
    })
  }
  getTargetDetails() {
    return this.tokenService.get(`${this.base_url_target}.json`).map(response=>{
      this.targets = response.json();
      return this.targets;
    })
  }

  createFitnessTest(fitness_test) {
    return this.tokenService.post(`${this.base_url}.json`, fitness_test).map(response=>{
      this.fitness_test = response.json();
      return this.fitness_test;
      //return response.status;
    })
  }

  updateFitnessTest(fitness_test) {
    console.log(`FitnessTestApi: Updating fitness_test`)
    console.log(fitness_test);
    return this.tokenService.put(`${this.base_url}/${fitness_test.id}.json`, fitness_test).map(response=>{
      this.fitness_test = response.json();
      return this.fitness_test;
    })
  }

  deleteFitnessTest(fitness_test) {
    return this.tokenService.delete(`${this.base_url}/${fitness_test.id}.json`).map(response=>{
      return response.status;
    })
  }

}
