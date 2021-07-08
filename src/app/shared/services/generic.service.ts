import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class GenericService<T> {

  url: string;
  httpHeaders: HttpHeaders;
  constructor(public http: HttpClient) { }
  
  setUrlExtension(extension: string){
    this.url += `/${extension}`;
  }

  getFullUrl(){
    return this.url;
  }

  public abstract resetUrl();

  get(): Observable<T>{
    return this.http.get<T>(this.url, {headers: this.httpHeaders});
  }

  post(data: T): Observable<T>{
    return this.http.post<T>(this.url, data, {headers: this.httpHeaders});
  }

  patch(data: T): Observable<T>{
    return this.http.patch<T>(this.url, data, {headers: this.httpHeaders});
  }

  delete(): Observable<T>{
    return this.http.delete<T>(this.url, {headers: this.httpHeaders});
  }

}
