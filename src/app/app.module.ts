import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { GooglePlaceDirective } from './google-place-autocomplete.directive';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
    GooglePlaceDirective
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
