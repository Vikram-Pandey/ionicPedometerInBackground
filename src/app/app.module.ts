import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RoundProgressBarComponent } from '../components/round-progress-bar/round-progress-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Sensors } from '@ionic-native/sensors';
import { Pedometer } from '@ionic-native/pedometer';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RoundProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    RoundProgressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RoundProgressBarComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Sensors,
    Pedometer,
    BackgroundMode,
    Autostart,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
