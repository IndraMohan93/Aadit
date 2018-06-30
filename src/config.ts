import { Injectable } from '@angular/core';

@Injectable()

export class Config {
    public facebook = {
        apiUrl: 'https://graph.facebook.com/v2.3/',
        appId: '2063291010658323',
        scope: ['email']
    };

    public google = {
        apiUrl: 'https://www.googleapis.com/oauth2/v3/',
        appId: '387943633858-nlnom38hab8epps1gfip6n7pmnlbkkt5.apps.googleusercontent.com',
        //appId: '122646457655-klvukf4knepd00eo2ler24rjqi8q07b7.apps.googleusercontent.com',
        scope: ['email']
    }

}