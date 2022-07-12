import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { BookingService } from '../core/services/booking.service';
import { SpinnerService } from '../core/services/spinner.service';
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
    private router: Router,
    private loader: SpinnerService
  ) { }

  ngOnInit(): void {

    //Getting Data From The Booking Service

    this.user = this.bookingService.user;
    this.timeStamp = this.bookingService.timeStamp;
    this.bookingDone = this.bookingService.bookingDone;

    //Checking if booking done or not if not done notifying the user using angular material snackbar

    if(!this.bookingDone){
      this.uiService.openSnackBar('Booking Failed Seats Not Available', 'OK');
    }

    //Getting all the seats from API call

    this.getAllSeats();
  }

  // API call to get all the seats and store in this.seats

  getAllSeats(){

    //Showing the loader

    this.loader.show();
    this.apiService.getAllSeats().subscribe((response: any) => {
      if(response){
        this.seats = response.data;

        //hiding the loader

        this.loader.hide();
      }

    }, error => {
      console.log(error);

      //hiding the loader
      
      this.loader.hide();
    })
  }

  //Function to navigate to home/admin-features

  goToAdminFeatures(){
    this.router.navigate(['home/admin-features']);
  }

  //Changing the booking service data on the component destruction

  ngOnDestroy(): void {
      this.bookingService.canActivateBookedPage = false;
      this.bookingService.user = {};
      this.bookingService.timeStamp = null;
  }

}
