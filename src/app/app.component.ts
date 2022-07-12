import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './core/services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'train-ticket-booking';

  loading$ = this.loader.loading$;
  constructor(public loader: SpinnerService) {}
}
