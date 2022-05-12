import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GettingStartedComponent } from "./getting-started/getting-started.component";
import { HomeComponent } from "./home/home.component";


const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    { path: "getting-started", component: GettingStartedComponent },
    { path: "home", component: HomeComponent }
];



@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

