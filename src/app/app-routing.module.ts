import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BookedComponent } from './booked/booked.component';
import { BookedGuard } from './core/guards/booked.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', redirectTo: '/home/booking', pathMatch: 'full'},
  {path: 'home/booking',
    component: HomeComponent
  },
  {path: 'home/booked',
    component: BookedComponent,
    canActivate: [BookedGuard]
  },
  {path: 'home/admin-features',
    component: AdminComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
