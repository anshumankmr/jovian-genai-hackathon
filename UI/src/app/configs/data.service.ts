import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ApiurlsService } from './api-urls.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, public url: ApiurlsService) { }

  get(url: string): Observable<any> {
    const option = {
      headers: new HttpHeaders()
    };
    return this.http.get(url, option).pipe(
      catchError(error => error)
    );
  }

  post(url: string, data: any): Observable<any> {
    const headerOptions = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
    return this.http
      .post(url, data, { headers: headerOptions })
      .pipe(catchError(error => error));
  }

  // Stream Data
  postStream(url: string, data: any): Promise<ReadableStream<Uint8Array> | null> {
    const headerOptions = new HttpHeaders({
      'Content-Type': 'application/text',
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(this.url.username + ":" + this.url.password)
      },
      body: JSON.stringify(data)
    }).then(response => response.body);
  }

  // store in localstoreage
  addRecentSearch(searchObj: any): void {
    let tempData = localStorage.getItem('search') || '';
    let recentSearch = [];
    if (tempData) {
      recentSearch = JSON.parse(tempData)
      recentSearch.push(searchObj);
    } else {
      recentSearch.push(searchObj);
    }
    if (recentSearch.length > 5) {
      recentSearch.splice(0, recentSearch.length - 5);
    }
    localStorage.setItem('search', JSON.stringify(recentSearch));
  }
}
