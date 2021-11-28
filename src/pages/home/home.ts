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
      this.ondateChange();
      this.fnGetPedoUpdate();
    }
  
  today:string=moment().toDate().getDate().toString();

    fnGetPedoUpdate(){
      if (this.platformCtrl.is('cordova')) {
        this.pedoCtrl.startPedometerUpdates()
         .subscribe((PedometerData) => {
             this.PedometerData = PedometerData;
             this.ngZoneCtrl.run(() => {
                this.stepCountToStorage += this.PedometerData.numberOfSteps;
                this.nativeStorage.setItem(this.today,this.stepCountToStorage).then((item)=>{
                  console.log("Stored Item"+item);
                  this.fnTost("itemStored");
                  error=>this.fnTost("error at nativestorage Set Item");
                })
                this.nativeStorage.getItem(this.today).then((currentStep)=>{
                  this.stepCount+=currentStep;
                  this.calories=Math.round(this.stepCount*0.5);
                this.miles=Math.round(this.stepCount*0.5);
                })
                this.fnTost(this.stepCount);
                // this.calories=Math.round(this.stepCount*0.5);
                // this.miles=Math.round(this.stepCount*0.5);
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
    //  this.stepCountToStorage = this.PedometerData.numberOfSteps;
      this.stepCountToStorage=100;
      console.log("StepCounter"+this.stepCountToStorage);
      console.log("today Variable"+this.today);
      this.nativeStorage.setItem(this.today,this.stepCountToStorage).then((item)=>{
        console.log("Stored Item"+item);
        error=>console.log("Error Storing Item",error);
      })

      console.log("Native Storage Set with key")
      this.nativeStorage.getItem(this.today).then((currentStep)=>{
        this.stepCount=currentStep;

      })

      this.calories=Math.round(this.stepCount*0.5);
                this.miles=Math.round(this.stepCount*0.5);
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
