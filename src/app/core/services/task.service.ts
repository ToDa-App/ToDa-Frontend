import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface TaskSummary {
  id: number;
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

  constructor(private http: HttpClient) { }

  getActiveTasks(page: number, status?: string, priority?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);

    return this.http.get(`${this.BASE_URL}/active`, { params });
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${id}`);
  }
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }
  updateTask(id: number, data: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}`, data);
  }
  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}`, taskData);
  }
  getDeletedTasks(page: number = 0): Observable<any> {
    return this.http.get(`${this.BASE_URL}/deleted?page=${page}`);
  }
  restoreTask(taskId: number): Observable<any> {
    return this.http.put(`${this.BASE_URL}/restore/${taskId}`, {});
  }
  logout(token: string): Observable<any> {
    return this.http.post(
      'http://localhost:8081/api/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  deleteUserAccount(): Observable<any> {
    return this.http.delete('http://localhost:8081/api/user');
  }

}
