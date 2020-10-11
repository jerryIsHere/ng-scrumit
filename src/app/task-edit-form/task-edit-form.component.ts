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
      creation: new FormControl({ value: new Date(task.creationDate), disabled: false }),
      id: new FormControl({ value: task.id, disabled: false }),
      duration: new FormControl({ value: task.duration, disabled: false })
    })
  }
  form: FormGroup
  dummyForm: FormGroup
  edit = false
  submitForm() {
    if (this.form.valid) {
      this.api.patchTask(this.data.id, this.form.value).then(result => {
        if (result) {
          this.dialogRef.close()
        }
      })

    }
  }
}
