import {Component, OnInit} from '@angular/core';
import {MapService} from "../_services/map.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../_services/user.service";
import {Loc} from "../_model/loc";
import {Observable} from "rxjs";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf,
    DatePipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  locs: Observable<Loc[]> | undefined;
  constructor(protected mapService: MapService, protected userService:UserService)  {
  }

  ngOnInit(): void {
    this.locs = this.mapService.getLocs(this.userService.user.id);
  }
}
