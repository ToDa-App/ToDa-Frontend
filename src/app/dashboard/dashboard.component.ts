import { Component, OnInit } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { TaskSummary } from '../core/services/task.service';

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

  constructor(private taskService: TaskService) { }

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
  onViewTaskDetails(task: TaskSummary): void {
    console.log('Task details:', task);
  }

  onAddTask(): void {
    console.log('Add task clicked');
  }

  onEditTask(task: TaskSummary): void {
    console.log('Edit clicked for task:', task);
  }

  onDeleteTask(task: TaskSummary): void {
    console.log('Delete clicked for task:', task);
  }

  goToDeletedTasks(): void {
    console.log('Navigate to deleted tasks');
  }

}
