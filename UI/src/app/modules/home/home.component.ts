import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  queryText = new FormControl();

  constructor(public route: Router) { }

  // search code
  searchCode(): boolean {
    if (this.queryText.value) {
      this.route.navigate(
        ['/search'],
        { queryParams: { q: encodeURIComponent(this.queryText.value) } }
      );
      return true;
    } else {
      return false;
    }
  }
}
