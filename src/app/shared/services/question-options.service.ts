import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionOptionsService extends GenericService<any> {

  httpHeaders = new HttpHeaders({"content-type": "application/json"});
  url = environment.endpoints.questionOptions;
  constructor(public http: HttpClient) { 
    super(http);
  }

  resetUrl(){
    this.url = environment.endpoints.questionOptions;
  }
}
