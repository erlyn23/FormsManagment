import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService extends GenericService<any> {

  url = environment.endpoints.questions;
  constructor(public http: HttpClient) {
    super(http);
  }

  resetUrl(){
    this.url = environment.endpoints.questions;
  }
}
