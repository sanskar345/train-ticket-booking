import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BookingService } from '../services/booking.service';

@Injectable({
  providedIn: 'root'
})
export class BookedGuard implements CanActivate {
  constructor(
    private router: Router,
    private bookingService: BookingService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.bookingService.canActivateBookedPage){
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

}
