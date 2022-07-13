import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urls } from '@env/accessurls';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
 
  constructor(private http: HttpClient) { }
 
  listTodos(request) {
    const endpoint = urls.SERVER_URL + urls.ActivityLog;
    const params = request;
    return this.http.get(endpoint, { params });
  }
}