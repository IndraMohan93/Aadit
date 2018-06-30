import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../providers/token-service';
import { Angular2TokenService } from 'angular2-token';
import { ResponseUtility } from '../../providers/response-utility';
import { Config } from '../../providers/config';
import { Http, RequestOptions, Headers } from '@angular/http';


@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordReset {

  token: any;
  password: any;
  confirm_password: any;
  headerInfo = {};

  slideOneForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private config: Config,
    private http: Http) {


    this.slideOneForm = formBuilder.group({
      token: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  reset() {

    let loader = this.loadingController.create({
      content: 'Reset in progress ...'
    });

    loader.present();
    this.tokenService.get(`auth/password/edit?reset_password_token=${this.token}&redirect_url=auth/password`).subscribe(
      res => {
        console.log(res);
        this.headerInfo = res.json();
        let params = {password: this.password, password_confirmation: this.confirm_password}
        loader.dismiss();this.resetPassword(this.headerInfo, params);
        
      },
      error => {
        console.log(error);
        loader.dismiss();
        this.respUtility.showFailure(error);
      }
    );
  }

  resetPassword(headerInfo: any, params: any) {

    console.log(headerInfo);

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json;q=0.9,*/*;q=0.8'); // Fix for Firefox
    headers.append('access-token', headerInfo['token']);
    headers.append('client', headerInfo['client_id']);
    headers.append('expiry', headerInfo['expiry']);
    headers.append('uid', headerInfo['uid']);
    headers.append('token-type', 'Bearer');

    console.log(params);
    let h = new RequestOptions({
      headers: headers
    });
    
    
    this.http.put(`${this.config.props['API_URL']}/auth/password`, params, h).subscribe(
      res => {
        console.log(res);
        this.respUtility.showSuccess("Password reset successfully. Please login");
        this.navCtrl.popToRoot();
      },
      error => {
        console.log(error);
        this.respUtility.showFailure(error);
      }
    );
  }


}
