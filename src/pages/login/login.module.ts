import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { OAuthService } from './oauth.service';
import { OAuthProfilePage } from './profile/oauth-profile.page';
import { Config } from '../../config';
import { GoogleOauthProvider } from './google/google-oauth.provider';
import { FacebookOauthProvider } from './facebook/facebook-oauth.provider';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_AUTH_CONFIG } from './../../app/app.firebase.config';

@NgModule({
  imports: [
    IonicModule,
    AngularFireModule.initializeApp(FIREBASE_AUTH_CONFIG)
  ],
  declarations: [
    OAuthProfilePage
  ],
  entryComponents: [
    OAuthProfilePage
  ],
  providers: [
    OAuthService,
    GoogleOauthProvider,
    FacebookOauthProvider,
    Config
  ]
})
export class LoginModule { }
