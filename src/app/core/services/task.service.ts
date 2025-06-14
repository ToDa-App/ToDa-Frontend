import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface TaskSummary {
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly BASE_URL = 'http://localhost:8082/api/tasks'; 

  constructor(private http: HttpClient) {}

  getActiveTasks(page: number, status?: string, priority?: string): Observable<any> {
  let params = new HttpParams().set('page', page.toString());
  if (status) params = params.set('status', status);
  if (priority) params = params.set('priority', priority);

  return this.http.get(`${this.BASE_URL}/active`, { params });
}


}
