import { Login } from './../login/login';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { UserApi } from '../../providers/user-api';
import { ResponseUtility } from '../../providers/response-utility';
import { Angular2TokenService } from 'angular2-token';
import { UserValidator } from './user-validator'
import { TermsPage } from '../static/terms';
import { CheckboxValidator } from '../../providers/checkbox-validator';
import { CompanyApi } from '../../providers/company-api';
import { GoalForm } from '../goals/goal-form';
import { GoogleSheetProvider } from './../../providers/google-sheets/google-sheet.provider';
import { SheetResourceProvider } from '../../providers/google-sheets/sheet-resource.provider';
import { AngularFireAuth } from 'angularfire2/auth';
@Component({
  selector: 'page-user-form',
  templateUrl: 'user-form.html',
})
export class UserForm {

  user: {};
  @ViewChild('signupSlider') signupSlider: any;
  @ViewChild('title') title;

  slideOneForm: FormGroup;
  adminForm: FormGroup;
  careGiverForm: FormGroup;

  submitAttempt: boolean = false;
  confirm_password;
  companies: any;

  googleLoginButtonId = "google-login-button";
  userAuthToken = null;
  userDisplayName = "empty";
  auth2: any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public userApi: UserApi,
    public companyApi: CompanyApi,
    public respUtility: ResponseUtility,
    public loadingController: LoadingController,
    private tokenService: Angular2TokenService,
    private afAuth: AngularFireAuth,
    private elementRef: ElementRef,
    private gSheetService: GoogleSheetProvider,
    private sheetService: SheetResourceProvider,
    private renderer: Renderer,
    private keyboard: Keyboard) {

    this.user = this.navParams.data;
    if (this.user["company_id"] && this.user["company_id"] == -1) {
      this.companyApi.getCompanies().subscribe(
        companies => {
          this.companies = companies;
          console.log("Loaded companies");
        },
        error => { this.respUtility.showFailure(error); },
        () => { }
      );
    }

    this.slideOneForm = formBuilder.group({
      first_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_\\-.]*'), Validators.required])],
      last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9_\\-.]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9\\-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(1)])],
      birth_year: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^\\d+$')])],
      company_id: [''],
      accept_terms: [false, Validators.compose([CheckboxValidator.isChecked, Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(11), Validators.pattern('^\\d+$')])],
    }, { "validator": this.isMatching });


    // Password may not be visible, hence disable validations 
    if (this.user["id"]) {
      this.slideOneForm.controls["password"].disable();
      this.slideOneForm.controls["password"].clearValidators();
      this.slideOneForm.controls["confirm_password"].disable();
      this.slideOneForm.controls["confirm_password"].clearValidators();
      console.log("Disabled password", this.slideOneForm.controls.password.disabled);
    }
    if(!gSheetService.isUserSignedIn()){
      this.gSheetService.signIn();
    }
  }

  onTermsChecked($event) {
    if (!$event.checked) {
      this.slideOneForm.patchValue({ accept_terms: null });
    }
  }

  isMatching(group: FormGroup) {


    let firstPassword = group.controls['password'].value;
    let secondPassword = group.controls['confirm_password'].value;
    console.log(`password check ${firstPassword}, ${secondPassword}`);


    if ((firstPassword && secondPassword) && (firstPassword != secondPassword)) {
      console.log("passwords mismatch");
      group.controls['confirm_password'].setErrors({ "pw_mismatch": true });
      return { "pw_mismatch": true };
    } else {
      return null;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserForm');
    this.respUtility.trackView("UserForm");
  }


  save() {
    this.respUtility.trackEvent("User", "Save", "click");
    this.submitAttempt = true;
    //console.log(this.user);
    let loader = this.loadingController.create({
      content: 'Saving ...'
    });
    if (this.slideOneForm.invalid) {
      //this.signupSlider.slideTo(0);
      console.log("Invalid form ", this.slideOneForm.errors);
    }
    else {
      this.submitAttempt = false;
      loader.present();
      console.log(this.slideOneForm.controls["email"].value,this.slideOneForm.controls["password"].value);
      this.afAuth.auth.createUserWithEmailAndPassword(
        this.slideOneForm.controls["email"].value,
        this.slideOneForm.controls["email"].value
        ).then((response) => {
          if(response.additionalUserInfo.isNewUser) {
            this.sheetService.saveUser(this.user,this.gSheetService.getToken(),'1VAtBwQY9RdK6TQE_XhBmOkJwNMiz1lf9CcVNdnecUjo').subscribe((response) => {
              console.log(response);
              loader.dismiss();
              this.navCtrl.push(Login);
            });
          }
          else {
            console.log('User name already exits');
            loader.dismiss();
            this.navCtrl.push(Login);
          }
        }, (error) => {
          console.log(error);
          loader.dismiss();
          this.navCtrl.push(Login);
        });
    }
  }
  register(user, loader) {
    this.respUtility.trackEvent("User", "Register", "click");
    // this.tokenService.registerAccount(user).subscribe(
    //   res => {
    //     console.log(res);
    //     this.respUtility.showSuccess("Please check your email for verification link. Verfiy your email & then login.");
    //     this.navCtrl.popToRoot();
    //     //this.navCtrl.push(GoalForm, {})
    //   },
    //   error => {
    //     console.log(error);
    //     if (error.status == 401) {
    //       let body = JSON.parse(error._body);
    //       this.respUtility.showWarning(body.errors);
    //     } else {
    //       this.respUtility.showFailure(error);
    //       loader.dismiss();
    //     }
    //   },
    //   () => { loader.dismiss(); }
    // );
  }
  appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
  show_terms() {
    this.navCtrl.push(TermsPage);
  }

}

