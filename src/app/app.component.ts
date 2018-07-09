import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Tab } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Users } from '../pages/users/users';
import { Angular2TokenService } from 'angular2-token';
import { Config } from '../providers/config';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LoginProvider } from '../providers/login-provider';
import { Events } from 'ionic-angular';

import { ResponseUtility } from '../providers/response-utility';
import { UserTabs } from '../pages/users/user-tabs';
import { UserForm } from '../pages/users/user-form';
import { RegisterPage } from '../pages/users/register';
import { FitnessTests } from '../pages/fitness-tests/fitness-tests'
import { Workouts } from '../pages/workouts/workouts';
import { FoodLogs } from '../pages/food-logs/food-logs';
import { Schedules } from '../pages/schedules/schedules';
import { Goals } from '../pages/goals/goals';
import { GoalForm } from '../pages/goals/goal-form';
import { MedicalForm } from '../pages/medicals/medical-form';
import { Login } from '../pages/login/login';
import { AboutPage } from '../pages/static/about';
import { HelpPage } from '../pages/static/help';
import { TermsPage } from '../pages/static/terms';
import { ContactPage } from '../pages/static/contact';

import { CodePush, SyncStatus, InstallMode } from '@ionic-native/code-push';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StressTests } from '../pages/stress-tests/stress-tests';
import { TabsPage } from '../pages/home/tabs';


@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;
  currentUser: any;

  pages: Array<{ title: string, component: any, params: any }> = [];

  constructor(
    private ga: GoogleAnalytics,
    private codePush: CodePush,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public push: Push,
    private tokenService: Angular2TokenService,
    private config: Config,
    public events: Events,
    public respUtility: ResponseUtility,
    private loginProvider: LoginProvider,
    public alertCtrl: AlertController) {

    this.events.subscribe('login:setroottabs', () => {
      this.nav.setRoot(TabsPage);
    })
    this.events.subscribe('login:setrootlogin', () => {
      this.nav.setRoot(Login);
    })
    this.initializeApp();


  }

  initGA() {
    this.ga.startTrackerWithId(this.config.props["GA_ID"])
      .then(() => {
        console.log('Google analytics is ready now');
        //this.ga.debugMode();
        this.ga.setAllowIDFACollection(true);
        this.ga.trackView('Main');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  initPushNotification() {
    console.log("initPushNotification");
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    const options: PushOptions = {
      android: {
        senderID: '600472014859'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("registrationId ->", data.registrationId);
      // Lets store this in the push_token. This is because at this point the user may not be logged in
      // When he logs in we will save it
      this.config.props["push_token"] = data.registrationId;
      console.log("this.config.props[push_token] = ", this.config.props["push_token"]);
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              //this.nav.push(DetailsPage, { message: data.message });
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        //this.nav.push(DetailsPage, { message: data.message });
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  initializeApp() {

    console.log(this.config.props["API_URL"]);

    this.platform.ready().then(
      () => {

        this.tokenService.init({
          apiBase: this.config.props["API_URL"],
          updatePasswordPath: "/auth/password"
        });

        this.hideSplashScreen();

        this.syncCodePush();

        this.initGA();

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.initPushNotification();


        this.currentUser = this.tokenService.currentUserData;

        this.events.subscribe('user:login:success', () => {
          console.log("AppComponent: user:login:success");
          this.currentUser = this.tokenService.currentUserData;

          this.ga.setUserId(this.currentUser["id"]); // Set the user ID using signed-in user_id.

          if (this.currentUser.initial_test_completed == true) {
            this.pages = [
              { title: 'Goals', component: Goals, params: {} },
              { title: 'Medicals', component: MedicalForm, params: { load_from_server: true } },
              { title: 'Tests', component: FitnessTests, params: {} },
              { title: 'Workouts', component: Workouts, params: {} },
              // { title: 'Schedules', component: Schedules, params: {} },
              { title: 'Stress Tests', component: StressTests, params: {} },
              { title: 'Food Logs', component: FoodLogs, params: {} },
              // { title: 'About Us', component: AboutPage, params: {} },
              { title: 'Terms & Conditions', component: TermsPage, params: {} },
              { title: 'Contact Us', component: ContactPage, params: {} },
              // { title: 'Help', component: HelpPage, params: {} },
            ];

          } else {
            this.pages = [
              // { title: 'Goals', component: Goals, params: {} },
              // { title: 'Medicals', component: MedicalForm, params: { load_from_server: true } },
              // { title: 'Tests', component: FitnessTests, params: {} },
              // { title: 'About Us', component: AboutPage, params: {} },
              { title: 'Terms & Conditions', component: TermsPage, params: {} },
              { title: 'Contact Us', component: ContactPage, params: {} },
              // { title: 'Help', component: HelpPage, params: {} },
            ];

          }


          // if (this.currentUser.accept_terms == null) {
          //   // The terms have changed - we need to get him to accept the terms again
          //   this.respUtility.showWarning("Our terms have changed. Please read and accept the terms & conditions");
          //   this.edit_profile();
          // } else if (this.currentUser.goals_setup == null) {
          //   // The terms have changed - we need to get him to accept the terms again
          //   this.respUtility.showWarning("Please setup your goals");
          //   this.setup_goals();
          // } else if (this.currentUser.medical_setup == null) {
          //   // The terms have changed - we need to get him to accept the terms again
          //   this.respUtility.showWarning("Please enter your medical history");
          //   this.setup_medicals();
          // }


        });

        this.events.subscribe('user:logout:success', () => {
          console.log("HomePage: user:logout:success");
          this.currentUser = null;

          this.pages = [
            { title: 'About Us', component: AboutPage, params: {} },
            { title: 'Terms & Conditions', component: TermsPage, params: {} },
            { title: 'Contact Us', component: ContactPage, params: {} },
          ];

        });

        if (this.currentUser == null) {
          this.loginProvider.auto_login(null);
          this.pages = [
            { title: 'About Us', component: AboutPage, params: {} },
            { title: 'Terms & Conditions', component: TermsPage, params: {} },
            { title: 'Contact Us', component: ContactPage, params: {} },
          ];
        }

      }
      , (error) => {
        console.log(error);
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, page.params);
  }


  show_settings() {
    this.nav.push(UserTabs, this.currentUser);
  }


  edit_profile() {
    this.nav.push(UserForm, this.currentUser);
  }

  setup_goals() {
    this.nav.push(GoalForm, {});
  }

  setup_medicals() {
    this.nav.push(MedicalForm, {});
  }


  login() {
    this.nav.push(Login);
  }


  logout() {
    this.loginProvider.logout();
  }

  syncCodePush() {
    if (this.platform.is('cordova')) {

      let updateDialogOptions = {
        updateTitle: "Updated available",
        optionalUpdateMessage: "A new app update is available. Install?",
        optionalIgnoreButtonLabel: "Not right now",
        optionalInstallButtonLabel: "Install Now"
      };

      const downloadProgress = (progress) => {
        console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
        //this.respUtility.showWarning(`Updating app. Please wait ....`);
      }

      const onSyncStatusChange = (syncStatus) => {
        let messageText = null;

        switch (syncStatus) {
          case SyncStatus.IN_PROGRESS:
            messageText = 'An update is in progress ..';
            break;

          case SyncStatus.CHECKING_FOR_UPDATE:
            messageText = 'Checking for update ..';
            break;

          case SyncStatus.DOWNLOADING_PACKAGE:
            messageText = 'Downloading package ..';
            break;

          case SyncStatus.INSTALLING_UPDATE:
            this.splashScreen.show();
            messageText = 'Installing update. Please wait ..';
            break;

          case SyncStatus.UPDATE_INSTALLED:
            messageText = 'Installed the update ..';
            break;

          case SyncStatus.ERROR:
            messageText = 'An error occurred :( ...';
            break;

          default:
            //messageText = 'Update done.';
            break;

        }
        if (messageText) {
          this.respUtility.showSuccess(messageText);
        }

      }

      this.codePush.sync({ updateDialog: updateDialogOptions, installMode: InstallMode.IMMEDIATE }, downloadProgress).subscribe(
        (syncStatus) => {
          console.log(syncStatus);
          onSyncStatusChange(syncStatus);
        });

      console.log("Initializing CodePush");
    } else {
      // Cordova not accessible, add mock data if necessary
      console.log("Not Initializing CodePush, load app on device");
    }
  }


  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    }
  }
}

