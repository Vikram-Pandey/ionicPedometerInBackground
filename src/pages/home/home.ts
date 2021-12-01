import { Component,ModuleWithComponentFactories,NgZone } from '@angular/core';
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors';
import { NavController, Platform } from 'ionic-angular';

import { ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Pedometer } from '@ionic-native/pedometer';
import moment from 'moment';
import { Autostart } from '@ionic-native/autostart';
import { Storage } from '@ionic/storage';


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
          public storage:Storage,
          public autoStart:Autostart)
    {
      this.stepCount=0;
      this.calories=0;
      this.miles=0.00;
      //this.ondateChange();
      console.log(this.interval());
      //this.init();
      //this.saveValueInStorage(this.getTodayDate(),2000);
     // this.checkifTodayExistInStorage(); //working
     //this.storage.clear();
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
                this.calories=0;
                this.miles=0;
               if(this.storage.get(today)===null){
                this.fnTost("We are at null wala");
                this.stepCount=stepsFromPedometer;
                this.saveValueInStorage(today,this.stepCount);
               }
               else{
                  this.storage.get(today).then((item)=>{
                    this.fnTost("We are at not null wala");
                    stepCountToStorage=item+stepsFromPedometer;
                   })
    
    
                   this.saveValueInStorage(today,stepCountToStorage);
    
                   this.stepCount=stepCountToStorage;
                

              
                
               
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


    // async init() {
    //   // If using a custom driver:
    //   // await this.storage.defineDriver(MyCustomDriver)
    //    await this.storage.;
    // }

    

   async saveValueInStorage(_key:string,_val:any){
      console.log("Starting to store ");
      this.storage.set(_key, _val);
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

    checkifTodayExistInStorage(){
      let today=this.getTodayDate();
      this.storage.get(today).then((data)=>{
        console.log("today value is",data);
        if(data){
          alert("Exists");
        }
        else{
          alert("False");
        }
      })
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
