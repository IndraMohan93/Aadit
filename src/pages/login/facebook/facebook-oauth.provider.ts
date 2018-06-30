import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { IOathProvider } from '../oauth.provider.interface';
import { OAuthProfile } from '../models/oauth-profile.model';
import { CordovaOauth } from 'ng2-cordova-oauth/oauth';
import { Facebook } from 'ng2-cordova-oauth/provider/facebook';
import { Config } from '../../../config';
import 'rxjs/add/operator/toPromise';

interface ILoginResponse {
    access_token: string;
}

interface IProfileResponse {
    first_name: string;
    last_name: string;
    email: string;
    provider?: string;
}

@Injectable()
export class FacebookOauthProvider implements IOathProvider {
    private cordovaOauth: CordovaOauth;
    private http: Http;
    private config: Config;
    private facebook: Facebook;

    constructor(http: Http, config: Config) {
        this.http = http;
        this.config = config;
        this.facebook = new Facebook({ clientId: config.facebook.appId, appScope: config.facebook.scope });
        this.cordovaOauth = new CordovaOauth(this.facebook);
    }

    login(): Promise<string> {
        // return null;
        return this.cordovaOauth.login()
            .then((x: ILoginResponse) => x.access_token);
    }

    getProfile(accessToken): Promise<OAuthProfile> {
        let query = `access_token=${accessToken}&format=json`;
        let url = `${this.config.facebook.apiUrl}me?${query}`;

        return this.http.get(url)
            .map(x => <IProfileResponse>x.json())
            .map((x: IProfileResponse) => {
                // let name = x.name.split(' ');
                console.log("facebook profile x value ", x);

                let profile: OAuthProfile = {
                    firstName: x.first_name,
                    lastName: x.last_name,
                    email: x.email,
                    provider: 'facebook'
                };
                console.log("facebook profile  value ", profile);
                return profile;
            })
            .toPromise();
    }
}