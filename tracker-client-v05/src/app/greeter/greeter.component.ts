import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StorageService} from "@ng-web-apis/storage";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-greeter',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './greeter.component.html',
  styleUrl: './greeter.component.css'
})
export class GreeterComponent implements OnInit{
  protected last_user:string|null = null;
  @Output() last_user_name:EventEmitter<string> = new EventEmitter<string>();
  constructor(protected storage:StorageService) {
  }
  ngOnInit(): void {
    this.last_user = localStorage.getItem('tracker_last_user');
    if (this.last_user) this.last_user_name.emit(this.last_user);
  }

}
