import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { UserDecoded } from '@shared/models/user-decoded';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() hasSesion: boolean;
  user: UserDecoded;
  constructor(private _authSvc: AuthService) { 
    if(this._authSvc.userData){
      
      this.user = jwt_decode(this._authSvc.userData.token);
    }
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.hasSesion = changes.hasSesion.currentValue;
  }

  logOut():void{
    this._authSvc.logOut();
  }
}
