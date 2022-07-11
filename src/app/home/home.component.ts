import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';

import { MOBILE_REGEX, ONLY_LETTERS } from '../core/constants/regex.constant';
import { ApiService } from '../core/services/api.service';
import { BookingService } from '../core/services/booking.service';
import { UiService } from '../core/services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bookingForm: FormGroup;
  seats: any = [];
  bookingIds: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private bookingService: BookingService,
    // private spinner: NgxSpinnerService
  )
  {
    this.bookingForm = this.buildForms();

  }

  ngOnInit(): void {
    this.getALLSeats();
  }

  buildForms(){
      return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.pattern(ONLY_LETTERS)]],
      contact: ['', [Validators.pattern(MOBILE_REGEX), Validators.required]],
      seatsRequired: ['', [Validators.required, Validators.max(7), Validators.min(1)]]
    })
  }

  get bookingFormControls(){
    return this.bookingForm.controls;
  }

  onClick(){
    console.log("onClicked");
    this.createUser({
      name: this.bookingForm.value.name,
      contactNumber: this.bookingForm.value.contact
    });
  }

  getALLSeats(){
    this.apiService.getAllSeats().subscribe((response: any) => {
      this.seats = response.data;
      console.log("seats", this.seats);
    }, error => {
      console.log(error);

    })
  }

  bookSeats(seatsRequired: Number, bookedBy: string){
    // this.spinner.show();
    if(this.checkIfSeatsAreAvailbleInRow(seatsRequired)){
      console.log("before update: ", this.bookingIds);

      this.updateSeats(bookedBy);
    }
    else if(this.bookNearSeats(seatsRequired)){
      this.updateSeats(bookedBy);


    }
    else{
      this.bookingService.bookingDone = false;
      this.bookingService.user = {
        name: this.bookingForm.value.name,
        contact: this.bookingForm.value.contact,
        id: bookedBy
        };

      this.bookingForm.reset();
      this.bookingService.canActivateBookedPage = true;
      // this.spinner.hide();
      this.router.navigate(['/home/booked']);
    }
  }

  checkIfSeatsAreAvailbleInRow(seatsRequired: Number): boolean{
    let seatsCount = 0;
    this.bookingIds = [];
    console.log("seats length",this.seats[0][0]);

    if(this.seats.length){
      for(let i=0; i<this.seats.length; i++){
        for(let j=0; j<this.seats[i].length; j++){
          if(this.seats[i][j].status === false){
            this.bookingIds.push(this.seats[i][j]._id);
            seatsCount++;
            if(seatsCount === seatsRequired){
              return true;
            }
          }
        }
        console.log("i am in");

        this.bookingIds = [];
        seatsCount = 0;
      }
    }
    return false;
  }

  bookNearSeats(seatsRequired: Number): boolean{
    console.log("bookNearSeats", seatsRequired);

    this.bookingIds = [];

    let startRow = this.getStartRow();

    console.log("strow", startRow);

    if(startRow === -1){
      return false;
    }

    let tempIds = [];
    let minDifference = Number.MAX_VALUE;
    let seatCount = 0;
    for(let i=startRow; i<this.seats.length; i++){
      let j=0;
      let assignJZero = false;

      while(j<this.seats[i].length){
        assignJZero = false;
        if(this.seats[i][j].status === false){
          seatCount = seatCount + 1;
          console.log("this.seats[i][j].status === false", seatCount);

          tempIds.push(this.seats[i][j]._id);
          if(seatCount == seatsRequired){
            console.log("seatCount === seatsRequired");

            if(i - startRow < minDifference){
              minDifference = i-startRow;
              this.bookingIds = tempIds;
            }
            tempIds = [];
            seatCount = 0;
            startRow = i;
            assignJZero = true;
          }
        }

        if(assignJZero){
          j = 0;
        }
        else{
          j++;
        }

      }
    }

    if(this.bookingIds.length){
      console.log("in in ", this.bookingIds);

      return true;
    }
    return false;

  }

  getStartRow(){
    for(let i=0; i<this.seats.length; i++){
      for(let j=0; j<this.seats[i].length; j++){
        if(this.seats[i][j].status === false){
          return i;
        }
      }
    }

    return -1;
  }

  createUser(data: {name: string, contactNumber: string}){
    this.apiService.createUser(data).subscribe((response: any) => {
        console.log(response);
        if(response){
          this.bookSeats(this.bookingForm.value.seatsRequired, response.data.user._id);
        }
    }, (error) => {
      console.log(error);

    });
  }

  updateSeats(bookedBy: string){
    console.log("after booknear: ", this.bookingIds);
    const bookedAt =  Date.now();
    this.bookingService.timeStamp = bookedAt;
    console.log("timestamp", bookedAt);
    this.recursivelyUpdateSeats(bookedBy, bookedAt);

  }

  recursivelyUpdateSeats(bookedBy: string, bookedAt: any){
    if(!this.bookingIds.length){
      console.log("booked all");
      this.bookingService.user = {
      name: this.bookingForm.value.name,
      contact: this.bookingForm.value.contact,
      id: bookedBy
      };
      this.bookingService.canActivateBookedPage = true;
      this.bookingForm.reset();
      this.bookingService.bookingDone = true;
      // this.spinner.hide();
      this.router.navigate(['/home/booked']);
      return;
    }

    this.apiService.updateSeatById({status: true, bookedBy, bookedAt }, this.bookingIds.splice(0,1)).subscribe((response: any) => {
      if(response){
        this.recursivelyUpdateSeats(bookedBy, bookedAt);
      }
    }, error => {
      console.log(error);

    })
  }

}


