import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CREATE_USER, SEAT, TRAIN_TICKET_BOOKING_API, UNBOOK_ALL_SEATS } from '../constants/apis.constant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  //API call to create user

  createUser(data: {
    name: string,
    contactNumber: string
  })
  {
    return this.http.post(
      `${TRAIN_TICKET_BOOKING_API}${CREATE_USER}`,
      data
    );
  }

  //API call to get all Seats

  getAllSeats(){
    return this.http.get(
      `${TRAIN_TICKET_BOOKING_API}${SEAT}`
    );
  }

  // API call to update seat by id

  updateSeatById(data: any, id: string){
    return this.http.patch(
      `${TRAIN_TICKET_BOOKING_API}${SEAT}${id}`,
      data
    );
  }

  // API call to unbook all seats

  unbookAllSeats(){
    return this.http.patch(
      `${TRAIN_TICKET_BOOKING_API}${UNBOOK_ALL_SEATS}`,
      {}
    );
  }
}
