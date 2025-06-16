import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { TaskSummary } from '../core/services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: TaskSummary[] = [];
  statusFilter: string = '';
  priorityFilter: string = '';
  currentPage = 0;

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getActiveTasks(this.currentPage, this.statusFilter, this.priorityFilter)
      .subscribe({
        next: (res: any) => {
          this.tasks = res.data?.content ?? [];
        },
        error: err => {
          console.error('Failed to fetch tasks:', err);
        }
      });

  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadTasks();
  }
  viewTask(task: TaskSummary): void {
    sessionStorage.setItem('taskId', task.id.toString());
    this.router.navigate(['/task-details']);
  }

  onAddTask(): void {
    this.router.navigate(['/add-task']);
  }
  showDeletedTasks(): void {
    this.router.navigate(['/deleted-tasks']);
  }

  editTask(task: any): void {
    sessionStorage.setItem('taskId', task.id.toString());
    this.router.navigate(['/task-edit']);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => console.error('Failed to delete task', err)
      });
    }
  }
}
