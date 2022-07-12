import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  //Material Snackbar 

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5400,
    });
  }
}
