import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  //behavioural subject for mat progress spinner

  private loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loading.asObservable();

  constructor() {}

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
