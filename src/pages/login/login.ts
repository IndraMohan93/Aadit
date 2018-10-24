import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../providers/token-service';
import { Angular2TokenService } from 'angular2-token';
import { ResponseUtility } from '../../providers/response-utility';
import { Config } from '../../providers/config';
import { LoginProvider } from '../../providers/login-provider';
import { UserApi } from '../../providers/user-api';
import { UserForm } from '../users/user-form';
import { PasswordReset } from './password-reset';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../users/register';

import { OAuthService } from './oauth.service';
import { OAuthProfilePage } from './profile/oauth-profile.page';
import { HomePage } from '../home/home';
//import { Login } from '../../login/login';
import { GoogleSheetProvider } from '../../providers/google-sheets/google-sheet.provider';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [OAuthService, AngularFireAuth]
})
export class Login {

  // email: any = "thimmaiah@gmail.com";
  //password: any = "thimmaiah@gmail.com";

  //email: any = "admin@ubernurse.com";
  //password: any = "admin@ubernurse.com";
  private oauthService: OAuthService;
  private nav: NavController;
  email: any;
  password: any;

  currentUser: any;
  slideOneForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    public events: Events,
    private tokenService: Angular2TokenService,
    private afAuth: AngularFireAuth,
    private config: Config,
    private loginProvider: LoginProvider,
    private userApi: UserApi,
    private gd: GoogleSheetProvider,
    private storage: Storage, oauthService: OAuthService, nav: NavController) {
    this.oauthService = oauthService;
    this.nav = nav;
    this.slideOneForm = formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])]
    });
  //  this.gd.load();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    this.respUtility.trackView("Login");
  }

  // ionViewWillEnter() {
  //   console.log('ionViewWillEnter HomePage ');
  //   if (this.currentUser) {
  //     this.nav.push(HomePage);
  //   };

  // }

  async login() {
    this.respUtility.trackEvent("User", "Login", "click");
    this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then(
      (response) => {
        this.events.publish('user:login:success');
        console.log(response);
      }
    ).catch( (error) => {
      this.events.publish('user:login:failed');
      console.log(error);
    });
    // this.loginProvider.login(this.email, this.password, this.navCtrl);
  }
  public signin(source: string) {
    this.oauthService.login(source)
      .then(
        () => this.nav.setRoot(OAuthProfilePage),
        error => alert(error)
      );
  }




  register() {
    this.respUtility.trackEvent("User", "Register", "click");
    this.navCtrl.push(RegisterPage);
  }

  resendConfirmationEmail() {
    this.respUtility.trackEvent("User", "ResendConfirmation", "click");
    if (this.email != null) {
      this.userApi.resendConfirmationEmail(this.email).subscribe(
        res => {
          console.log(res);
          if (res["sent"] == true) {
            this.respUtility.showSuccess("Confirmation email sent. Please check your inbox.");
          } else {
            if (res["user_not_found"] == true) {
              this.respUtility.showWarning("Email specified above was not found in our system. Please register.");
            } else {
              this.respUtility.showWarning("Confirmation email not sent. Please contact us.");
            }
          }
        },
        error => this.respUtility.showFailure(error)
      );
    } else {
      this.respUtility.showWarning("Please enter a valid email above.");
    }

  }

  forgotPassword() {
    this.respUtility.trackEvent("User", "ForgotPassword", "click");
    if (this.email != null) {
      this.tokenService.resetPassword({ email: this.email }).subscribe(
        res => {
          console.log(res);
          let body = JSON.parse(res["_body"]);
          console.log(body["message"]);
          this.respUtility.showMsg(body["message"]);
          this.navCtrl.push(PasswordReset)
        },
        error => this.respUtility.showFailure(error)
      );
    } else {
      this.respUtility.showWarning("Please enter a valid email above.");
    }
  }
}
