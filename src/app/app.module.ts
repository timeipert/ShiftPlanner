import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { ShifttableComponent } from './shifttable/shifttable.component';
import {RouterModule} from "@angular/router";
import {routes} from "./routes";
import { MemberListComponent } from './member-list/member-list.component';
import { AvailabilityFormComponent } from './availability-form/availability-form.component';
import {FormsModule} from "@angular/forms";
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ShifttableComponent,
    MemberListComponent,
    AvailabilityFormComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
