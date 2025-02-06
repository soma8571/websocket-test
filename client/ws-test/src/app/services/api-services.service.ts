import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  private url = ''

  constructor(private http: HttpClient) { }

  
}
