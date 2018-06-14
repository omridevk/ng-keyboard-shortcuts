import { NgModule }                                          from '@angular/core';
import { BrowserModule }                                     from '@angular/platform-browser';
import { BrowserAnimationsModule }                           from '@angular/platform-browser/animations';
import { AppComponent }                                      from './app.component';
import { KeyboardShortcutsModule, KeyboardShortcutsService } from 'ng-keyboard-shortcuts';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatListModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    KeyboardShortcutsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule
  ],
  providers: [KeyboardShortcutsService],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
