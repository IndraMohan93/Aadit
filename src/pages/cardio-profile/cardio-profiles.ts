import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { Chart } from 'chart.js';

@Component({
  selector: 'cardio_profiles',
  templateUrl: 'cardio-profiles.html',
})
export class CardioProfiles {

  @ViewChild('lineCanvas') lineCanvas;

  cardio_profiles: any;
  cardio_profile: any;
  lineChart: any;
  speeds: any;
  bpms: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public respUtility: ResponseUtility) {
    this.cardio_profiles = navParams.data;

    this.speeds = [];
    this.bpms = [];
    this.cardio_profiles.forEach(c => {
      this.speeds.push(c.speed)
      this.bpms.push(c.bpm);
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter CardioProfiles');
    this.respUtility.trackView("CardioProfiles");

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: this.speeds,
        datasets: [
          {
            label: "Cardio Profile",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.bpms,
            spanGaps: false,
          }
        ]
      }

    });



  }

}
