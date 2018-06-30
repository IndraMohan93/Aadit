import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class CompanyApi {


  private base_url = "companies";
  private remoteEndpoint;
  companies = [];
  company = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('CompanyApi Provider Created');
  }

  getCompanies() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.companies = response.json();
      return this.companies;      
    })
  }

  getCompanyDetails(company_id) {
    return this.tokenService.get(`${this.base_url}/${company_id}.json`).map(response=>{
      this.company = response.json();
      return this.company;
    })
  }

  createCompany(company) {
    return this.tokenService.post(`${this.base_url}.json`, company).map(response=>{
      this.company = response.json();
      return this.company;
      //return response.status;
    })
  }

  updateCompany(company) {
    console.log(`CompanyApi: Updating company`)
    console.log(company);
    return this.tokenService.put(`${this.base_url}/${company.id}.json`, company).map(response=>{
      this.company = response.json();
      return this.company;
    })
  }

}
