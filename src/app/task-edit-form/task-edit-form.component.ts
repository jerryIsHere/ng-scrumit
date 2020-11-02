import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';


@Component({
  selector: 'app-task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.css']
})
export class TaskEditFormComponent implements OnInit {


  constructor(public api: ApiAgentService,
    public dialogRef: MatDialogRef<TaskEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    let task = this.api.tasks.filter(task => task.id == this.data.id)[0]
    this.form = new FormGroup({
      description: new FormControl({ value: task.description, disabled: false }, Validators.required),
      commencement: new FormControl({ value: task.commencement, disabled: false }, Validators.min(0))
    })
    this.dummyForm = new FormGroup({
      creationDate: new FormControl({ value: new Date(task.creationDate), disabled: false }),
      id: new FormControl({ value: task.id, disabled: false }),
      duration: new FormControl({ value: task.duration, disabled: false })
    })
  }
  form: FormGroup
  dummyForm: FormGroup
  edit = false
  submitForm() {
    if (this.form.valid) {
      let body = { ...this.form.value }
      let dp = new DatePipe('en-US')
      Object.keys(body).forEach((key) => {
        if ((body[key] == null || body[key] == '')) { delete body[key] }
        if (body[key] instanceof Date) body[key] = dp.transform(body[key], 'dd.MM.yyyy')
      });
      this.api.patchTaskDescription(body).then(result => {
        if (result) {
          this.dialogRef.close()
        }
      })

    }
  }
}
