import { NgModule }                                          from '@angular/core';
import { BrowserModule }                                     from '@angular/platform-browser';
import { BrowserAnimationsModule }                           from '@angular/platform-browser/animations';
import { AppComponent }                                      from './app.component';
import { KeyboardShortcutsModule, KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { MdButtonModule, MdCardModule, MdFormFieldModule, MdInputModule, MdListModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    KeyboardShortcutsModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdButtonModule,
    MdListModule,
    MdInputModule,
    MdFormFieldModule
  ],
  providers: [KeyboardShortcutsService],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
