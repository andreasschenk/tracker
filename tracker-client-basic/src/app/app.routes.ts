import { Routes } from '@angular/router';
import {MapComponent} from "./map/map.component";
import {TrackerComponent} from "./tracker/tracker.component";
import {loggedInGuard} from "./_guards/logged-in.guard";
import {ListComponent} from "./list/list.component";
import {LinksComponent} from "./links/links.component";


export const routes: Routes = [
  {path: 'links', component: LinksComponent},
  {path: 'map', component: MapComponent},
  {path: 'tracker', component: TrackerComponent, canActivate: [loggedInGuard]},
  {path: 'list', component: ListComponent, canActivate: [loggedInGuard]},
  {path: '', redirectTo: 'map', pathMatch: 'full'},
  {path: '**', redirectTo: 'map'},
];
