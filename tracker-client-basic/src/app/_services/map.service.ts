import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import * as Leaflet from "leaflet";
import {HttpClient} from "@angular/common/http";
import {Loc} from "../_model/loc";
import {ConfigService} from "./config.service";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = Leaflet.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Leaflet.Marker.prototype.options.icon = iconDefault;


@Injectable({
  providedIn: 'root'
})
export class MapService {
  //private map: Leaflet.Map | undefined;
  //private tiles : Leaflet.TileLayer | undefined;
  constructor(private http: HttpClient, private configService: ConfigService)  { }

  public initMap(element:HTMLElement|null): Leaflet.Map | undefined {
    let map: Leaflet.Map | undefined;
    if(element) {
      //if (this.map) this.map.remove();
      map = Leaflet.map(element, {
        center: [47.07406072835198, 15.437525930487219],
        zoom: 7
      });
    }
    console.log("map init");
    return map;
    }
  public getTiles():Leaflet.TileLayer{
    console.log("add tiles");
    return Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
  }
  public saveLoc(userid:string,latitude:number, longitude:number, time:Date):Observable<Loc>{
    return this.http.post<Loc>(this.configService.serverUrl + "/users/location/",
      {userid:userid,latitude:latitude,longitude:longitude,time:time});
  }
  public getLocs(userid:string):Observable<Loc[]> {
    return  this.http.get<Loc[]>(this.configService.serverUrl + "/users/locations/"+userid);
  }
}
