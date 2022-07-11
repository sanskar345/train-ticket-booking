import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { BookingService } from '../core/services/booking.service';
import { UiService } from '../core/services/ui.service';

@Component({
  selector: 'app-booked',
  templateUrl: './booked.component.html',
  styleUrls: ['./booked.component.css']
})
export class BookedComponent implements OnInit, OnDestroy {

  seats: any = [];
  user: any;
  timeStamp: any;
  bookingDone: any;

  constructor(
    private apiService: ApiService,
    private bookingService: BookingService,
    private uiService: UiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.bookingService.user;
    this.timeStamp = this.bookingService.timeStamp;
    this.bookingDone = this.bookingService.bookingDone;
    if(!this.bookingDone){
      this.uiService.openSnackBar('Booking Failed No Seats Available', 'OK');
    }
    this.getAllSeats();
  }

  // API call to get all the seats and store in this.seats

  getAllSeats(){
    this.apiService.getAllSeats().subscribe((response: any) => {
      this.seats = response.data;
      console.log("seats", this.seats);
    }, error => {
      console.log(error);

    })
  }

  goToAdminFeatures(){
    this.router.navigate(['home/admin-features']);
  }

  ngOnDestroy(): void {
      this.bookingService.canActivateBookedPage = false;  
  }

}
