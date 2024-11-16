import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

 private baseUrl = 'https://api.countrystatecity.in/v1'; // Base URL for the API
  private apiKey = 'NG5CZlpnUm9HWHdkbFUybTFvNVR4WEJrdUFkQzZ0eTFYRG5pSjN2TA=='; // Replace with your actual API Key

  constructor(private http: HttpClient) {}

  // Fetch the list of countries
  getCountries(): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-CSCAPI-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.baseUrl}/countries`, { headers });
  }

  // Fetch states for a specific country
  getStates(countryCode: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-CSCAPI-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.baseUrl}/countries/${countryCode}/states`, { headers });
  }

  // Fetch cities for a specific state
  getCities(countryCode: string, stateCode: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'X-CSCAPI-KEY': this.apiKey
    });
    return this.http.get<any[]>(`${this.baseUrl}/countries/${countryCode}/states/${stateCode}/cities`, { headers });
  }
}
