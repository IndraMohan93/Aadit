import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  saveAgreement: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.saveAgreement = false;
    console.log('ionViewDidLoad TermsPage');
  }

  saveAggrement() {
    this.saveAgreement = true;
    console.log('saved agreement');
  }

  onSubmit() {
    if (this.saveAgreement) {
      this.navCtrl.pop();

    } else {
      let alert = this.alertCtrl.create({
        title: 'Please select check box to agree terms and conditions',
        buttons: ['Dismiss']
      });
      alert.present();
    }

  }

}
