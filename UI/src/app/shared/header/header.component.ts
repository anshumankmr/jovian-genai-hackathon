import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() isSearchEnabled = true;
  queryText = new FormControl();

  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["q"].length) {
        this.queryText.setValue(decodeURIComponent(params["q"]));
      }
    });
  }

  searchCode(): boolean {
    if (this.queryText.value) {
      this.router.navigate(
        ['/search'],
        { queryParams: { q: encodeURIComponent(this.queryText.value) } }
      );
      return true;
    } else {
      return false;
    }
  }

  clearSearch(): void {
    this.queryText.setValue('');
    this.router.navigate(['/search']);
  }
}
