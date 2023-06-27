import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bugTrackerAngularApp';
  constructor(public auth: AngularFireAuth, private router: Router) {
  }

  logout() {
    this.auth.signOut().then(v=> this.router.navigate(['/login']));
  }
}
