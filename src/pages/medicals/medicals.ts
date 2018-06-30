import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { MedicalForm } from './medical-form';
import { MedicalApi } from '../../providers/medical-api';

@Component({
  selector: 'medicals',
  templateUrl: 'medicals.html',
})
export class Medicals {

  medicals: any = [];
  medical: any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public medicalApi: MedicalApi,
    public respUtility: ResponseUtility) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter Medicals');
    this.respUtility.trackView("Medicals");
    let loader = this.loadingController.create({
      content: 'Loading Medicals..'
    });

    loader.present();

    this.medicalApi.getMedicals().subscribe(
      medicals => {
        this.medicals = medicals;
        console.log("Loaded medicals");
        console.log(Object.prototype.toString.call(this.medicals));
      },
      error => { this.respUtility.showFailure(error); loader.dismiss(); },
      () => { loader.dismiss(); }
    );

  }

  editMedicalDetails(medical) {
    this.respUtility.trackEvent("MedicalForm", "Form", "click");
    this.navCtrl.push(MedicalForm, medical);
  }

  getMedicalText(name) {
    return this.medicalApi.getMedicalText(name);
  }
}
