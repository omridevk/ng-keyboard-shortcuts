import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { KeyboardShortcutsModule } from "@ng-keyboard-shortcuts/ng-keyboard-shortcuts";
import { AppRoutingModule } from "./app-routing.module";
import { GettingStartedComponent } from "./getting-started/getting-started.component";
import { HomeComponent } from "./home/home.component";
import { MaterialModule } from "./material-module";
import { NestedComponent } from "./nested/nested.component";

@NgModule({
    imports: [
        BrowserModule,
        KeyboardShortcutsModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule
    ],
    declarations: [AppComponent, GettingStartedComponent, HomeComponent, NestedComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
