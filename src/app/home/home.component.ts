import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MOBILE_REGEX, ONLY_LETTERS } from '../core/constants/regex.constant';
import { ApiService } from '../core/services/api.service';
import { BookingService } from '../core/services/booking.service';
import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Booking form and seats declaration we are assuming seats data as 2d array

  bookingForm: FormGroup;
  seats: any = [];

  //array of seat ids that need to be booked

  bookingIds: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private bookingService: BookingService,
    private loader: SpinnerService
  )
  {
    //Initializing booking form
    this.bookingForm = this.buildForms();
  }

  ngOnInit(): void {

    //Getting all the seats from database

    this.getALLSeats();
  }

  //Building booking form

  buildForms(){
      return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.pattern(ONLY_LETTERS)]],
      contact: ['', [Validators.pattern(MOBILE_REGEX), Validators.required]],
      seatsRequired: ['', [Validators.required, Validators.max(7), Validators.min(1)]]
    })
  }

  //get function to return booking form controls

  get bookingFormControls(){
    return this.bookingForm.controls;
  }

  //function for button click event

  onClick(){

    //showing loading spinner
    this.loader.show();

    //Firstly Creating User by the input data or updating it

    this.createUser({
      name: this.bookingForm.value.name,
      contactNumber: this.bookingForm.value.contact
    });
  }

  //To get all the seats from the API call

  getALLSeats(){

    //Showing loading spinner
    this.loader.show();
    this.apiService.getAllSeats().subscribe((response: any) => {
      if(response){
        //Storing the response data to the this.seats array
        //The data is in 2d array
        this.seats = response.data;
        //Hiding the loading spinner

        this.loader.hide();
      }
    }, error => {
      //Log if error
      console.log(error);
      //Hiding the loading spinner
      this.loader.hide();
    })
  }

  // Book seats function with conditions--
  // 1. If seats are available in one row
  // 2. Checking if seats are available or not and if then booking the nearest seats
  // 3. If seats are not available
  // Booked by is a user id

  bookSeats(seatsRequired: Number, bookedBy: string){

    //If seats are available in one row storing them in this.bookingIds and calling API call for updation
    if(this.checkIfSeatsAreAvailbleInRow(seatsRequired)){
      this.updateSeats(bookedBy);
    }

    //If seats are available then taking the ids of nearer seats and calling API for updation
    else if(this.bookNearSeats(seatsRequired)){
      this.updateSeats(bookedBy);
    }

    //If seats are not available updating booking service data and navigating to home/booked
    else{
      this.bookingService.bookingDone = false;
      this.bookingService.user = {
        name: this.bookingForm.value.name,
        contact: this.bookingForm.value.contact,
        id: bookedBy
        };

      this.bookingForm.reset();
      this.bookingService.canActivateBookedPage = true;
      this.loader.hide();
      this.router.navigate(['/home/booked']);
    }
  }

  //Function to check if seats are available in ine row

  checkIfSeatsAreAvailbleInRow(seatsRequired: Number): boolean{
    //Declaring a count variable and making this.bookingIds empty
    let seatsCount = 0;
    this.bookingIds = [];

    //Looping through this.seats which is a 2d array

    if(this.seats.length){
      for(let i=0; i<this.seats.length; i++){
        for(let j=0; j<this.seats[i].length; j++){
          //if seat is available
          if(this.seats[i][j].status === false){

            //pushing it in this.bookingIds and updating the count and
            //and checking if requiredseat is equal to availble in row if yes return true
            this.bookingIds.push(this.seats[i][j]._id);
            seatsCount++;
            if(seatsCount === seatsRequired){
              return true;
            }
          }
        }
        //After traversal in a row updating count to zero and this.bookinIds to empty
        this.bookingIds = [];
        seatsCount = 0;
      }
    }

    //If seats are not available in one row
    return false;
  }

  //Function to check whether seats are available if then storing the nearer seats in this.boookingIds

  bookNearSeats(seatsRequired: Number): boolean{

    //Making this.bookingIds empty and and declaring startRow variable for staring loop from availble seat row
    this.bookingIds = [];

    let startRow = this.getStartRow();
    //if seats are not available returning false
    if(startRow === -1){
      return false;
    }

    // TempIds for temporary storing the seat ids

    let tempIds = [];
    // minimum difference between the starting row and the current row
    let minDifference = Number.MAX_VALUE;
    // count variable
    let seatCount = 0;

    //Starting the loop from availble seat row and checking for nearer seat availability
    //looping through 2d array
    for(let i=startRow; i<this.seats.length; i++){
      //initializing j for traversing through 2d array columns

      let j=0;

      //Conditional variable for to assign zero to varible j as per requirement
      let assignJZero = false;

      //looping through columns
      while(j<this.seats[i].length){
        assignJZero = false;
        //If seat available

        if(this.seats[i][j].status === false){
          //Increasing the seat count
          seatCount = seatCount + 1;
          //Pushing seat id temp array
          tempIds.push(this.seats[i][j]._id);
          //If count is equal to required seats

          if(seatCount == seatsRequired){
            //checking if the difference between starting row and current row is less than the previous minDifference
            //if yes then updating the this.bookingIds

            if(i - startRow < minDifference){
              minDifference = i-startRow;
              this.bookingIds = tempIds;
            }
            //Updating the variables

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

    //if this.bookingIds have length then returning true as seats are available

    if(this.bookingIds.length){
      return true;
    }
    return false;

  }

  //Function to get the starting row for book near seat function

  getStartRow(){
    for(let i=0; i<this.seats.length; i++){
      for(let j=0; j<this.seats[i].length; j++){
        if(this.seats[i][j].status === false){
          return i;
        }
      }
    }
    //Returining -1 if no seats available
    return -1;
  }

  //Function to call api for creating user

  createUser(data: {name: string, contactNumber: string}){
    this.apiService.createUser(data).subscribe((response: any) => {

        if(response){
          //On user creation calling bookSeats function by getting the user id

          this.bookSeats(this.bookingForm.value.seatsRequired, response.data.user._id);
        }
    }, (error) => {
      console.log(error);

    });
  }

  //Basic function for iniatialing required variables and calling another function to call api

  updateSeats(bookedBy: string){
    const bookedAt =  Date.now();
    this.bookingService.timeStamp = bookedAt;
    this.recursivelyUpdateSeats(bookedBy, bookedAt);

  }

  //Recursivelly calling seat update api and updating seats

  recursivelyUpdateSeats(bookedBy: string, bookedAt: any){

    //Base condition to return from loop
    if(!this.bookingIds.length){
      this.bookingService.user = {
      name: this.bookingForm.value.name,
      contact: this.bookingForm.value.contact,
      id: bookedBy
      };
      this.bookingService.canActivateBookedPage = true;
      this.bookingForm.reset();
      this.bookingService.bookingDone = true;
      this.loader.hide();
      this.router.navigate(['/home/booked']);
      return;
    }

    this.apiService.updateSeatById({status: true, bookedBy, bookedAt }, this.bookingIds.splice(0,1)).subscribe((response: any) => {
      if(response){

        //Recursive call
        this.recursivelyUpdateSeats(bookedBy, bookedAt);
      }
    }, error => {
      console.log(error);

    })
  }

}


