import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiurlsService } from 'src/app/configs/api-urls.service';
import { DataService } from 'src/app/configs/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('typingAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 1, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class SearchComponent {

  searchedText: string = "";
  queryText: string = "";
  routeSubscription!: Subscription;
  sourceSubscription!: Subscription;
  SOSubscription!: Subscription;

  sourceDataLoading = 'loading';
  searchDataLoading = 'loading';
  stackOverflowDataLoading = 'loading';

  sourcesDataList!: any[];
  streamedData: any = [];
  SODataList: any = [];

  constructor(private activatedroute: ActivatedRoute,
    private route: Router,
    public dataService: DataService,
    public urls: ApiurlsService
  ) {
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedroute.queryParams
      .subscribe(params => {
        this.queryText = decodeURIComponent(params["q"]);

        // Searched text
        this.searchedText = JSON.stringify(this.queryText);

        this.getMainSearchResults();
        this.getSources();
        this.getSOSources();
      });
  }


  async getMainSearchResults() {
    const data = {
      prompt: this.queryText,
    }
    this.streamedData = [];
    const stream = await this.dataService.postStream(`${this.urls.streamingSearchUrl}`, data);

    if (stream) {
      const reader = stream.getReader();
      const processStream = async () => {
        while (true) {
          const result = await reader.read();

          if (result?.done) {
            this.searchDataLoading = 'data';
            console.log('Stream completed');
            break;
          }
          this.handleStreamData(result?.value);
        }
      };

      processStream();
    }
  }

  handleStreamData(data: any) {
    const textData = new TextDecoder().decode(data);
    this.streamedData = [textData];
  }


  getSources(): void {
    this.sourceDataLoading = 'loading';
    this.sourceSubscription = this.dataService.get(`${this.urls.sourcesUrl}&q=${this.queryText}`)
      .subscribe({
        next: (data) => {
          this.sourceDataLoading = 'data';
          this.sourcesDataList = data.items;
        },
        error: (error) => {
          this.sourceDataLoading = 'error';
        }
      });
  }

  getSOSources(): void {
    this.stackOverflowDataLoading = "loading";
    let data = {
      query: this.queryText
    };
    this.SOSubscription = this.dataService.post(`${this.urls.stackOverflowUrl}`, data)
      .subscribe({
        next: (data) => {
          this.stackOverflowDataLoading = 'data';
          this.SODataList = data;
        },
        error: (error) => {
          this.stackOverflowDataLoading = 'error';
        }
      });
  }

  ngOnDestroy(): void {
    this.SOSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.sourceSubscription.unsubscribe();
  }
}
