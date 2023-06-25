import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  queryText = new FormControl();

  constructor(public router: Router) {}

  searchCode(): boolean {
    if (this.queryText.value) {
      this.router.navigate(
        ['/search'],
        { queryParams: { q: encodeURIComponent(this.queryText.value) } }
      )
      return true;
    } else {
      return false;
    }
  }
}
