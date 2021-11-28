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
      //this.ondateChange();
      console.log(this.interval());
      this.fnGetPedoUpdate();
    }
  
  today:string=moment().toDate().getDate().toString();

    fnGetPedoUpdate(){
      if (this.platformCtrl.is('cordova')) {
        this.pedoCtrl.startPedometerUpdates()
         .subscribe((PedometerData) => {
             this.PedometerData = PedometerData;
             this.ngZoneCtrl.run(() => {
               //this.stepCount=this.PedometerData.numberOfSteps;
               this.stepCountToStorage = this.PedometerData.numberOfSteps;
              
               if(this.interval()!=0 && this.stepCountToStorage==0){
                this.stepCount=this.getValueFromStorage();
              }

              else if(this.interval()==0){
                 // savetoDatabase();
              }

              else{
                  this.stepCount=this.stepCountToStorage;
                  this.saveValueInStorage(this.today,this.stepCountToStorage);
              }

               
                // this.fnTost(this.stepCountToStorage);
                // this.nativeStorage.setItem(this.today,this.stepCountToStorage).then((item)=>{
                //   console.log("Stored Item"+item);
                //   this.fnTost("itemStored");
                //   error=>this.fnTost("error at nativestorage Set Item");
                // })

               

                // this.stepCount=this.getValueFromStorage();
                  this.fnTost(this.stepCount);
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

     getValueFromStorage(){
      let val=this.nativeStorage.getItem(this.today).then((item)=>{
          return item.steps;
      });

      return val;
    }

    saveValueInStorage(_key:string,_val:number){
      this.nativeStorage.setItem(_key,{'steps':_val}).then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
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


    interval(){
     return moment("24:00:00", "hh:mm:ss").diff(moment(), 'seconds');
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
