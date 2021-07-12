import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerService extends GenericService<any> {

  httpHeaders: HttpHeaders = new HttpHeaders({"content-type": "application/json", 
  "authorization": `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`});
  url = environment.endpoints.answers;
  constructor(public http: HttpClient) { 
    super(http);
  }

  resetUrl(){
    this.url = environment.endpoints.answers;
  }
}
