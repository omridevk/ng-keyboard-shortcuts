import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { KeyboardShortcutsModule, KeyboardShortcutConfig } from "ng-keyboard-shortcuts";
import { AppRoutingModule } from './app-routing.module';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from "./material-module";

const keyboardShortcutConfig: KeyboardShortcutConfig = {
    key: "ctrl + e",
    showHelp: true
};

@NgModule({
    imports: [
        BrowserModule,
        KeyboardShortcutsModule.forRoot(keyboardShortcutConfig),
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule
    ],
    declarations: [AppComponent, GettingStartedComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
