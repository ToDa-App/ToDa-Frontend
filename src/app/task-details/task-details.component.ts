import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../core/services/task.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit {
  task: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    let taskId = nav?.extras?.state?.['taskId'];

    if (!taskId) {
      taskId = sessionStorage.getItem('taskId');
      console.warn('Using fallback taskId from sessionStorage');
    }
    if (taskId) {
      this.taskService.getTaskById(Number(taskId)).subscribe({
        next: (res) => this.task = res.data,
        error: (err) => console.error('Failed to load task details', err)
      });
    } else {
      console.error('No task ID provided');
    }
  }
  editTask(): void {
    sessionStorage.setItem('editTaskId', this.task.id.toString());
    this.router.navigate(['/edit-task']);
  }
  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Failed to delete task', err)
      });
    }
  }
}