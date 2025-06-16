import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { TaskSummary } from '../core/services/task.service';

@Component({
  selector: 'app-deleted-tasks',
  templateUrl: './deleted-tasks.component.html',
  styleUrls: ['./deleted-tasks.component.scss']
})
export class DeletedTasksComponent implements OnInit {
  deletedTasks: TaskSummary[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  constructor(private taskService: TaskService) { }
  ngOnInit(): void {
    this.loadDeletedTasks();
  }
  loadDeletedTasks(): void {
    this.taskService.getDeletedTasks(this.currentPage).subscribe({
      next: (res) => {
        console.log('Deleted Tasks Response', res);
        this.deletedTasks = res.data.content;
        this.totalPages = res.data.totalPages;
      },
      error: (err) => {
        console.error('Failed to load deleted tasks', err);
      }
    });
  }
  restore(taskId: number): void {
    this.taskService.restoreTask(taskId).subscribe({
      next: () => {
        alert('Task restored!');
        this.loadDeletedTasks();
      },
      error: (err) => {
        alert('Failed to restore task');
        console.error(err);
      }
    });
  }
  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadDeletedTasks();
    }
  }
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadDeletedTasks();
    }
  }
}
