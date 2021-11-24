import { Component,NgZone } from '@angular/core';
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors';
import { NavController, Platform } from 'ionic-angular';

import { ToastController } from 'ionic-angular';

import { Pedometer } from '@ionic-native/pedometer';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  start: boolean;
	PedometerData:any;
	stepCount : any = 0;

   constructor(public toastCtrl: ToastController,
  			  private ngZoneCtrl: NgZone,
  			  public platformCtrl: Platform,
  			  public pedoCtrl: Pedometer)
    {
      this.stepCount=0;
    }
  
  
    fnGetPedoUpdate(){
      if (this.platformCtrl.is('cordova')) {
        this.pedoCtrl.startPedometerUpdates()
         .subscribe((PedometerData) => {
             this.PedometerData = PedometerData;
             this.ngZoneCtrl.run(() => {
                this.stepCount = this.PedometerData.numberOfSteps;
               // this.startDate = new Date(this.PedometerData.startDate);
               // this.endDate = new Date(this.PedometerData.endDate);
              });
       });
       this.start = true;
       this.fnTost('Please Walk🚶‍to Get Pedometer Update.');
    }else{
      this.fnTost('This application needs to be run on📱device');
    }
    }
  
    fnStopPedoUpdate(){
      this.pedoCtrl.stopPedometerUpdates();
      this.start = false;
    }
  
    fnTost(message) {
        let toast = this.toastCtrl.create({
          message: message,
          position: 'bottom',
          duration: 3000
        });
        toast.present();
    }
      
  

}
