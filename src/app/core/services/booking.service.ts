import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  bookingDone: Boolean = true;
  user: any = {};
  timeStamp: any;
  canActivateBookedPage = false;

  constructor() { }
}
