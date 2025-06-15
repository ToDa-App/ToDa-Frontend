import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../core/services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  editForm!: FormGroup;
  taskId!: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(sessionStorage.getItem('taskId'));
    if (!id || isNaN(id)) {
      console.error('No valid task ID');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.taskId = id;

    this.taskService.getTaskById(id).subscribe({
      next: (res) => {
        const task = res.data;
        this.editForm = this.fb.group({
          title: [task.title, Validators.required],
          description: [task.description],
          priority: [task.priority, Validators.required],
          status: [task.status, Validators.required],
          startDate: [task.startDate, Validators.required],
          dueDate: [task.dueDate, Validators.required]
        });
      },
      error: (err) => {
        console.error('Failed to load task data', err);
      }
    });
  }

  onSave(): void {
    if (this.editForm.invalid) return;

    this.taskService.updateTask(this.taskId, this.editForm.value).subscribe({
      next: () => {
        alert('Task updated successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update task');
      }
    });
  }
}
