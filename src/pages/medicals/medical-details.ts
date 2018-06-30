import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { MedicalApi } from '../../providers/medical-api';
import { ResponseUtility } from '../../providers/response-utility';

import * as _ from 'lodash';

@Component({
  selector: 'medical-details',
  templateUrl: 'medical-details.html',
})
export class MedicalDetails  {

  medical: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public medicalApi: MedicalApi,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {

    this.medical = this.navParams.data;

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter MedicalDetails');
    this.respUtility.trackView("MedicalDetails");
    // Always reload the medical from the server for a fresh copy
    this.loadMedical();
  }

  loadMedical() {
    let loader = this.loadingController.create({
      content: 'Loading Medical...'
    });

    loader.present();

    this.medicalApi.getMedicalDetails(this.medical.id).subscribe(
      response => {
        //this.respUtility.showSuccess("Loaded Medical");
        this.medical = response;
        console.log("Loaded medical");
        console.log(this.medical);
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );
  }

  getMedicalText(name) {
    return this.medicalApi.getMedicalText(name);
  }
}
