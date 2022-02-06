import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { KeyboardShortcutsModule } from "ng-keyboard-shortcuts";
import { AppRoutingModule } from './app-routing.module';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from "./material-module";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    imports: [
        BrowserModule,
        KeyboardShortcutsModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        MatIconModule
    ],
    declarations: [AppComponent, GettingStartedComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
