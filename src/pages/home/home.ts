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
  
  

    fnGetPedoUpdate(){
      if (this.platformCtrl.is('cordova')) {
        this.pedoCtrl.startPedometerUpdates()
         .subscribe((PedometerData) => {
             this.PedometerData = PedometerData;
             this.ngZoneCtrl.run(() => {
               //this.stepCount=this.PedometerData.numberOfSteps;
               let stepsFromPedometer;
               let stepCountToStorage;
               let today=this.getTodayDate();
               let keyExist;
               stepsFromPedometer = this.PedometerData.numberOfSteps;

               if(this.nativeStorage.keys().then((keys)=>{
                for(let keyitems in keys){
                  if(keyitems==today){
                    keyExist=true;
                  }
                }
               }))

               if(keyExist==true){
                this.nativeStorage.getItem(today).then((item)=>{
                  stepCountToStorage=item.steps+stepsFromPedometer;
                 })
  
  
                 this.saveValueInStorage(today,stepCountToStorage);
  
                 this.stepCount=stepCountToStorage;

               }
               else{
                 this.stepCount=stepsFromPedometer;
               }

              

                  //update database every 5 mins
                  //fix this.today.
                  //Work on server to aggregagte data after 3 months.
        
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

    getTodayDate(){
      return moment().toDate().getDate().toString();
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
