import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private loader: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  //Unbook all seats and navigate to home

  unbookAllSeats(){
    this.loader.show();
    this.apiService.unbookAllSeats().subscribe((response: any) => {
      if(response){
        this.router.navigate(['']);
        this.loader.hide();
      }

    }, error => {
      console.log(error);
      this.loader.hide();
      this.router.navigate(['']);
    });

  }

}
