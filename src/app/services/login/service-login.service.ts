import { Injectable } from '@angular/core';
import { ApiService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceLoginService {

  constructor(private _appService: ApiService) { }

  login(data: object) {
    return this._appService.getQuery('login', 'post', data);
  }
}
