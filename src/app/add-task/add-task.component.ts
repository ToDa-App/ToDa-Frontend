import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../core/services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['MEDIUM', Validators.required],
      status: ['PENDING', Validators.required],
      startDate: [''],
      dueDate: [''],
      completionDate: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.taskService.createTask(this.taskForm.value).subscribe({
      next: () => {
        alert('Task created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Failed to create task:', err);
        alert('Error creating task.');
      }
    });
  }
}
