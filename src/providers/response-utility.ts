import { Injectable } from '@angular/core';
import { AlertController, ToastController, ModalController, Toast } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class ResponseUtility {

  toast: Toast;

  constructor(
    private ga: GoogleAnalytics,
    public http: Http,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController) {
    console.log('ResponseUtility Provider Created');
  }

  showMsg(msg) {

    try {
      this.toast.dismiss();
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }


  showSuccess(msg) {
    try {
      this.toast.dismiss();
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000, cssClass: "toast-success",
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }

  showWarning(msg) {
    try {
      this.toast.dismiss();
    } catch (e) { }

    this.toast = this.toastController.create({
      message: msg,
      duration: 4000, cssClass: "toast-warning",
      position: 'bottom',
      dismissOnPageChange: false,
      showCloseButton: false
    });

    this.toast.present();
    console.log(msg)
  }

  showFailure(error, msg = null) {
    if (error.status == 401) {
      let body = JSON.parse(error._body);
      this.showWarning(body.errors);
    } else if (error.status == 422) {
      let body = JSON.parse(error._body);
      this.showWarning(body.errors.full_messages);
    } else {
      this.showFailureAlert(error, msg);
    }
  }

  showFailureAlert(error, msg = null) {

    if (!msg) {
      msg = 'The operations you were trying failed. Please contact the administrator. ';
    }

    let confirm = this.alertController.create({
      title: 'Error',
      cssClass: 'error-alert',
      message: msg + ` </br> ${error}`,
      buttons: [
        { text: 'OK' }
      ]
    });
    confirm.present();
    console.log(msg)
  }

  confirmDelete(deleteEntityFn, entity, title = "Delete") {
    let confirm = this.alertController.create({
      title: title,
      cssClass: 'delete-alert',
      message: 'Are you sure you want to proceed ?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            deleteEntityFn(entity);
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    
    confirm.present();
  }

  confirmAction(actionFn, entity, msg) {
    let confirm = this.alertController.create({
      title: "Confirm",
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => { actionFn(entity); }
        },
        { text: 'No' }
      ]
    });
    confirm.present();
  }

  popup(title, msg) {
    let confirm = this.alertController.create({
      title: title,
      message: msg,
      buttons: [
        { text: 'Ok' }
      ]
    });
    confirm.present();
  }

  trackView(view) {
    this.ga.trackView(view);
  }

  trackEvent(category, action, label, value=null, newSession=false) {
    this.ga.trackEvent(category, action, label, value, newSession)
  }

  trackMetric(key, value) {
    this.ga.trackMetric(key, value);
  }
}
