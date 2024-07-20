import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private _http: HttpClient) {}

  getQuery(query: string, type: 'get' | 'post' | 'delete' | 'put', body?: any): Observable<any> {
    const url = `${environment.url}${query}`;
    const headers = new HttpHeaders({ Accept: 'application/json' });

    switch (type) {
      case 'get':
        return this._http.get(url, { params: body, headers });
      case 'post':
        return this._http.post(url, body, { headers });
      case 'delete':
        return this._http.delete(url, { headers, body });
      case 'put':
        return this._http.put(url, body, { headers });
      default:
        throw new Error(`Tipo de petición no soportado: ${type}`);
    }
  }
}
