import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  @Input() user: any;
  @Output() onSave$ = new EventEmitter(undefined);
  addTaskForm: any;
  constructor(private formBuilder: FormBuilder,
              private coreService: CoreService) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      task: ['', Validators.required]
    })
  }

  addTask() {
    const task = this.addTaskForm.value.task;
    this.addTaskForm.reset();
      this.onSave$.emit(task);
  }
}
