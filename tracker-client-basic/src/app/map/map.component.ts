import {AfterViewInit, Component} from '@angular/core';
import * as Leaflet from 'leaflet';
import {MapService} from "../_services/map.service";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  imports: [
    MatButton
  ],
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  private map: Leaflet.Map | undefined;
  constructor(private mapService: MapService) {
  }
  ngAfterViewInit(): void {
    if (this.map) this.map.remove();
    this.map = this.mapService.initMap(document.getElementById("map"));
    if (this.map) this.mapService.getTiles().addTo(this.map);
  }
}

