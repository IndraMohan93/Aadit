import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ResponseUtility } from '../../providers/response-utility';
import { FitnessTestApi } from '../../providers/fitness-test-api';
import * as HighCharts from 'highcharts';
import * as $ from "jquery";
import * as s from './fitness-tests-details.scss';
import { DatePipe } from '@angular/common';
import { StressTestApi } from '../../providers/stress-test-api';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from "rxjs/observable/forkJoin";

declare var require: any;
require('highcharts/highcharts-more')(HighCharts);
@Component({
  selector: 'fitness-tests',
  templateUrl: 'fitness-tests.html',
})
export class FitnessTests {
  fitness_tests_data: any;
  weightArr: any;
  stress_tests: any;
  targets: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController,
    public fitness_test_api: FitnessTestApi,
    public stress_testApi: StressTestApi,
    public respUtility: ResponseUtility) {
  }
  loadTests() {
    console.log("Calling load tests");
    this.getFitnessTests();
  }
  makeStressChart() {
    //    HighCharts.chart('stressTest', {
    var chartStress = HighCharts.chart('stressTest', {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {
        enabled: false
      },
      title: {
        enable: true,
        text: 'Stress Meter',
        style: { color: '#FF00FF', fontSize: '10px', fontWeight: 'bold' },
        align: 'center'
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%'
        }, {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '107%'
        }, {
          // default background
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%'
        }]
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 40,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        plotBands: [{
          from: 0,
          to: 14,
          color: '#55BF3B' // green
        }, {
          from: 14,
          to: 26,
          color: '#DDDF0D' // yellow
        }, {
          from: 26,
          to: 40,
          color: '#DF5353' // red
        }]
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: false
          }
        },
        gauge: {
          dial: {
            backgroundColor: '#DF5353',
          }
        }
      },
      series: [{
        name: 'score',
        data: [this.stress_tests.map(a => a.score)],
      }]
    },
    );
  }
  makeChart() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var cardioprofiles = this.fitness_tests_data.map(a => a.cardio_profiles);
    var seriesArr: { name: string, data: number[][] }[];
    seriesArr = new Array();
    var speedSet = new Set<Number>();
    for (var cp of cardioprofiles) {
      var speeds = [[2]];
      cp.forEach(c => {
        var point = new Array();
        console.log('speed,bpm', c.speed, c.bpm);
        point.push(c.speed);  //x 
        point.push(c.bpm);  //y
        speeds.push(point);
        speedSet.add(c.speed);
      });
      console.log("cp[0]", cp[0]);
      var dtName = new DatePipe('en-US').transform(new Date(cp[0].on_date), 'dd MMM');
      seriesArr.push({ name: dtName, data: speeds });
    };
    console.log('speedSet == ', speedSet);
    HighCharts.chart('Cardio', {
      credits: {
        enabled: false
      },
      title: {
        text: null
      },
      subtitle: {
        text: 'Source: Aadit Life Wellness Program'
      },
      xAxis: {
        categories: speedSet.values,
      },
      yAxis: {
        title: {
          text: 'Heart Rate(BPM)'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 0,
          line: {
            dataLabels: {
              enabled: true,
              formatter: function () {
                if ((this.point.x === 15) ||
                  (this.point.x === 7)) {
                  return this.point.y;
                }
                return '';
              },
            },
          },
        },
      },
      //series:[{name:'x',data:[[4,100],[5,120]]},{name:'y',data:[[5,130],[6,140]]}],
      series: seriesArr,
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    });
    var months = this.fitness_tests_data.map(a => monthNames[new Date(a.test_date).getMonth()]);
    var charts = [],
      $containers = $('.trellis> div'),
      plotOptions: {
        fontSize: '10px'
      },
      datasets = [
        {
          name: 'Weight (kg)',
          data: this.fitness_tests_data.map(a => a.weight),
          ymin: 30,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.weight))),
          target: this.targets[0].weight
        },
        {
          name: 'Body Age (Years)',
          data: this.fitness_tests_data.map(a => a.body_age),
          ymin: 0,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.body_age))),
          target: this.targets[0].body_age
        },
        {
          name: 'Fat %',
          data: this.fitness_tests_data.map(a => a.fat_percentage),
          ymin: 0,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.fat_percentage))),
          target: this.targets[0].fat_percentage
        },
        {
          name: 'muscle %',
          data: this.fitness_tests_data.map(a => a.muscle_percentage),
          ymin: 0,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.muscle_percentage))),
          target: this.targets[0].muscle_percentage
        },
        {
          name: 'viscal fat %',
          data: this.fitness_tests_data.map(a => a.visc_fat),
          ymin: 0,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.visc_fat))),
          target: this.targets[0].visc_fat
        },
        {
          name: 'Body Mass Index',
          data: this.fitness_tests_data.map(a => a.bmi),
          ymin: 0,
          ymax: Math.max.apply(Math, (this.fitness_tests_data.map(a => a.bmi))),
          target: this.targets[0].bmi
        }
      ];
    HighCharts.seriesTypes.column.prototype.getExtremesFromAll = true;
    $.each(datasets, function (i, dataset) {
      charts.push(new HighCharts.Chart({
        chart: {
          renderTo: $containers[i],
          type: 'bar'
        },
        title: {
          text: null
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: months,
          labels: {
            enabled: i === 0 || i === 2 || i === 4
          },
          style: {
            fontSize: '10px'
          }
        },
        yAxis: {
          allowDecimals: false,
          "minPadding": 0,
          "maxPadding": 0,
          style: {
            fontSize: '8px'
          },
          title: {
            text: dataset.name,
            style: {
              color: '#FF00FF',
              fontWeight: 'bold',
              fontSize: '10px'
            }
          },
          min: dataset.ymin,
          max: dataset.ymax,
          plotLines: [{
            color: '#FF00FF',
            width: 2,
            value: dataset.target,
          }],
        },
        plotOptions: {
          series: {
            pointPadding: 0,
            borderWidth: 0,
            pointWidth: 10,
            dataLabels: {
              enabled: true,
              shape: 'callout',
              style: {
                fontSize: '10px'
              }
            }
          }
        },
        legend: {
          enabled: false
        },
        series: [dataset]
      }));
    });
    var chartStress = HighCharts.chart('wellnessIndex', {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      credits: {
        enabled: false
      },
      title: {
        enable: true,
        text: 'wellness index',
        style: { color: '#FF00FF', fontSize: '10px', fontWeight: 'bold' },
        align: 'center'
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#FFF'],
              [1, '#333']
            ]
          },
          borderWidth: 0,
          outerRadius: '109%'
        }, {
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, '#333'],
              [1, '#FFF']
            ]
          },
          borderWidth: 1,
          outerRadius: '107%'
        }, {
          // default background
        }, {
          backgroundColor: '#DDD',
          borderWidth: 0,
          outerRadius: '105%',
          innerRadius: '103%'
        }]
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 40,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          step: 2,
          rotation: 'auto'
        },
        plotBands: [{
          from: 0,
          to: 14,
          color: '#55BF3B' // green
        }, {
          from: 14,
          to: 26,
          color: '#DDDF0D' // yellow
        }, {
          from: 26,
          to: 40,
          color: '#DF5353' // red
        }]
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: false
          }
        },
        gauge: {
          dial: {
            backgroundColor: '#DF5353',
          }
        }
      },
      series: [{
        name: 'score',
        data: [8],
      }]
    },
    );
  }
  ionViewWillEnter() {
    this.loadTests();
    console.log('ionViewWillEnter FitnessTests');
    this.respUtility.trackView("FitnessTests");
    //this.getFitnessTests();
  }
  /*sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }*/
  getFitnessTests() {
    if (this.fitness_tests_data) {
      console.log("fitness tests present");
      return Promise.resolve(this.fitness_tests_data);
    }

    let loader = this.loadingController.create({
      content: 'Loading FitnessTests..'
    });
    loader.present();

    this.fitness_test_api.getFitnessTests()
      .subscribe(
        fitness_tests => {
          this.fitness_tests_data = fitness_tests;
          this.makeChart();
        },
        error => {
          this.respUtility.showFailure(error);
        }
      );
    this.fitness_test_api.getTargetDetails().subscribe(
      targets => {
        this.targets = targets;
        console.log('targets = ', this.targets);
        //this.makeChart();
      },
      error => {
        this.respUtility.showFailure(error);
      }
    );
    this.stress_testApi.getStressTests().subscribe(
      stress_tests => {
        //this.respUtility.showSuccess("Loaded StressTest");
        this.stress_tests = stress_tests;
        console.log("Loaded stress_test");
        console.log(this.stress_tests);
        this.makeStressChart();
      },
      error => {
        this.respUtility.showFailure(error);
        loader.dismiss();
      },
      () => { loader.dismiss(); }
    );

  }
}
