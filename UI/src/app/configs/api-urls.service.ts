import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiurlsService {

  // Api urls
  baseUrl = "https://jovian-backend-nhhrta7ioa-et.a.run.app";
  version = "v1";

  googleBaseUrl = "https://www.googleapis.com/customsearch/v1";
  googleKey = "AIzaSyD4iQvTSTXqsTYRzU-DPEatAWFknB_cGVU";
  googleCx = "b28ad1433882d41c7";

  username = "user";
  password = "43drNBHKGd@JRF#X";

  searchUrl!: string;
  streamingSearchUrl!: string;
  sourcesUrl!: string;

  constructor() {
    this.loadUrls();
  }

  loadUrls(): void {
    this.streamingSearchUrl = `${this.baseUrl}/stream-create-code-completions/chat-gpt`;
    this.searchUrl = `${this.baseUrl}${this.version}/llm`;
    this.sourcesUrl = `${this.googleBaseUrl}?key=${this.googleKey}&cx=${this.googleCx}`;
  }
}
