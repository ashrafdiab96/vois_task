import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'applicatiokn/json',
    'Access-Control-Allow-Origin': '*',
    // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private baseUrl = 'https://raw.githubusercontent.com/mosafwat/analysis-fe-challenge/master/data.json';
  private proxyUrl = 'https://cors-anywhere.herokuapp.com/';

  constructor(private http: HttpClient) {}

  public getJSON() {
    const url = `${this.proxyUrl}${this.baseUrl}`;
    return this.http.get(url, httpOptions).toPromise().then((data) => {
      // return data;
      console.log(data)
    });
  }
}
