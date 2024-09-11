import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {GeolocationService} from "@ng-web-apis/geolocation";
import {AsyncPipe, NgIf} from "@angular/common";
import {MessageService} from "../_services/message.service";
import {MapComponent} from "../map/map.component";
import * as Leaflet from "leaflet";
import {MapService} from "../_services/map.service";
import {LatLng} from "leaflet";
import {Loc} from "../_model/loc";
import {MatButton} from "@angular/material/button";
import {UserService} from "../_services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MapComponent,
    MatButton,
  ],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements  AfterViewInit,OnDestroy {
  private map: Leaflet.Map | undefined;
  public loc:Loc|undefined;
  protected ll:Leaflet.LatLng|undefined;
  protected readonly Object = Object;
  private sub:Subscription|undefined;
  constructor(private mapService: MapService, readonly geolocation: GeolocationService,
              private messageService: MessageService, private userService: UserService) {
    this.sub = this.geolocation.subscribe(pos => {
      this.ll = new LatLng(pos.coords.latitude, pos.coords.longitude);
      console.log("t init: -> " + this.ll.lat + " , " + this.ll.lng);
      this.map?.setView(this.ll, 16);
      const marker = Leaflet.marker(this.ll);
      if (this.map) marker.addTo(this.map);
    });
  }
  ngAfterViewInit(): void {
    console.log("tracker init");
    if (this.map) this.map.remove();
    this.map = this.mapService.initMap(document.getElementById("tmap"));
    if (this.map) {
      this.mapService.getTiles().addTo(this.map);
    }
  }
  saveLoc():void{
    this.mapService.saveLoc(this.userService.user.id, this?.ll?.lat ?? 0, this?.ll?.lng ?? 0, new Date())
      .subscribe(loc => this.loc = loc);
  }
  @HostListener("window:beforeunload")
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
