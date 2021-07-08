import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class FormsService extends GenericService<any> {

  url = environment.endpoints.forms;
  httpHeaders = new HttpHeaders({"content-type": "application/json",
  "authorization": `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`});
  constructor(public http: HttpClient) { 
    super(http);
  }

  setUrlExtension(extension: string){
    this.url += `/${extension}`;
  }

  getFullUrl(){
    return this.url;
  }

  resetUrl(){
    this.url = environment.endpoints.forms;
  }
}
