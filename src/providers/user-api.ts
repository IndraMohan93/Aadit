import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2TokenService } from 'angular2-token';


@Injectable()
export class UserApi {

  private base_url = "users";
  private remoteEndpoint;
  users = [];
  user = {};

  constructor(public http: Http, private tokenService: Angular2TokenService) {
    console.log('UserApi Provider Created');
  }

  getUsers() {
    
    return this.tokenService.get(`${this.base_url}.json`).map(response=>{
      this.users = response.json();
      return this.users;      
    })
  }

  getUserDetails(user_id) {
    return this.tokenService.get(`${this.base_url}/${user_id}.json`).map(response=>{
      this.user = response.json();
      return this.user;
    })
  }

  sendVerificationCode() {
    return this.tokenService.post(`${this.base_url}/send_sms_verification.json`, {}).map(response=>{
      let resp = response.json();
      return resp;
    })
  }

  confirmVerificationCode(code) {
    return this.tokenService.post(`${this.base_url}/verify_sms_verification.json`, {"code": code}).map(response=>{
      let resp = response.json();
      return resp;
    })
  }

  createUser(user) {
    return this.tokenService.post(`${this.base_url}.json`, user).map(response=>{
      this.user = response.json();
      return this.user;
      //return response.status;
    })
  }

  updateUser(user) {
    console.log(`UserApi: Updating user`)
    console.log(user);
    return this.tokenService.put(`${this.base_url}/${user.id}.json`, user).map(response=>{
      this.user = response.json();
      return this.user;
    })
  }

  deleteUser(user) {
    return this.tokenService.delete(`${this.base_url}/${user.id}.json`).map(response=>{
      return response.status;
    })
  }

  resendConfirmationEmail(email) {
    return this.tokenService.post(`${this.base_url}/resend_confirmation.json`, {"email":email}).map(response=>{
      this.user = response.json();
      return this.user;
      //return response.status;
    })
  }
}
