import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class MedicalApi {

  medicalText = {
  }

  private base_url = "medical_histories";
  private remoteEndpoint;
  medicals = [];
  medical = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('MedicalApi Provider Created');
  }

  getMedicals() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.medicals = response.json();
      return this.medicals;      
    })
  }

  getMedicalDetails(medical_id) {
    return this.tokenService.get(`${this.base_url}/${medical_id}.json`).map(response=>{
      this.medical = response.json();
      return this.medical;
    })
  }

  createMedical(medical) {
    return this.tokenService.post(`${this.base_url}.json`, medical).map(response=>{
      this.medical = response.json();
      return this.medical;
      //return response.status;
    })
  }

  updateMedical(medical) {
    console.log(`MedicalApi: Updating medical`)
    console.log(medical);
    return this.tokenService.put(`${this.base_url}/${medical.id}.json`, medical).map(response=>{
      this.medical = response.json();
      return this.medical;
    })
  }

  deleteMedical(medical) {
    return this.tokenService.delete(`${this.base_url}/${medical.id}.json`).map(response=>{
      return response.status;
    })
  }

  getMedicalText(name) {
    return this.medicalText[name];
  }
}
