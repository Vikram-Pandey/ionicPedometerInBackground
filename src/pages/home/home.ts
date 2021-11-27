import { Component,ModuleWithComponentFactories,NgZone } from '@angular/core';
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors';
import { NavController, Platform } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Pedometer } from '@ionic-native/pedometer';
import moment from 'moment';
import { Autostart } from '@ionic-native/autostart';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  start: boolean;
	PedometerData:any;
	stepCount : any = 0;
  max=1000;
  calories:number=0;
  miles:number=0.00;
  stepCountToStorage:number=0;

   constructor(public toastCtrl: ToastController,
  			  private ngZoneCtrl: NgZone,
  			  public platformCtrl: Platform,
  			  public pedoCtrl: Pedometer,
          public nativeStorage:NativeStorage,
          public autoStart:Autostart)
    {
      this.stepCount=0;
      this.calories=0;
      this.miles=0.00;
      this.fnGetPedoUpdate();
    }
  
  today:string=moment().format();

    fnGetPedoUpdate(){
      if (this.platformCtrl.is('cordova')) {
        this.pedoCtrl.startPedometerUpdates()
         .subscribe((PedometerData) => {
             this.PedometerData = PedometerData;
             this.ngZoneCtrl.run(() => {
                this.stepCountToStorage = this.PedometerData.numberOfSteps;
                this.nativeStorage.setItem(this.today,this.stepCountToStorage);
                this.stepCount=this.nativeStorage.getItem(this.today);
                this.calories=Math.round(this.stepCount*0.5);
                this.miles=Math.round(this.stepCount*0.5);
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


    ondateChange(){

    }


    calorieCalculator(){
      // this.calories=Math.round(this.stepCount*0.045);
      this.calories=Math.round(this.stepCount*0.5);

    }

    mileCalculator(){
      //this.miles=Math.round(this.stepCount*0.0005);
      this.miles=Math.round(this.stepCount*0.5);
    }

    


    
  
  

}
