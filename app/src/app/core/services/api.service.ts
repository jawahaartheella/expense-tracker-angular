import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(protected http: HttpClient) { }

  get<T>(url: string, options?:{params?: HttpParams | {[params: string]: string | number | boolean | ReadonlyArray<string | number | boolean>}, headers?: HttpHeaders | {[headers: string]: string | string[]}}): Observable<T> {
    return this.http.get<T>(url, options);
  }
  
  post<T>(url: string, body: any, options?: {params?: any, headers?: any}): Observable<T> {
     // Why "options?: {params?: any, header?: any}" ?
     // Force HttpClient to return only type {params?: any, header?: any} and (prevents HttpEvent<T> issues)
    return this.http.post<T>(url, body, {
      observe: 'body',
      ...options
    });
  }

  put<T>(url: string, body: any, options?: {params?: any, headers?: any}): Observable<T> {
    return this.http.put<T>(url, body, {
      observe: 'body',
      ...options
    });
  }

  delete<T>(url: string, options?: {params?: any, headers?: any}): Observable<T> {
    return this.http.delete<T>(url, {
      observe: 'body',
      ...options
    });
  }
  
}
