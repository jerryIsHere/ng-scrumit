import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-story-add-task-form',
  templateUrl: './story-add-task-form.component.html',
  styleUrls: ['./story-add-task-form.component.css']
})
export class StoryAddTaskFormComponent implements OnInit {

  constructor(public api: ApiAgentService,
    public dialogRef: MatDialogRef<StoryAddTaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
  }
  form = new FormGroup({
    description: new FormControl('', Validators.required)
  })
  submitForm() {
    if (this.form.valid) {
      let body = { ...this.form.value }
      let dp = new DatePipe('en-US')
      Object.keys(body).forEach((key) => {
        if ((body[key] == null || body[key] == '')) { delete body[key] }
        if (body[key] instanceof Date) body[key] = dp.transform(body[key], 'dd.MM.yyyy')
      });
      this.api.postStoryTask(this.data.id, body).then(result => {
        if (result) {
          this.dialogRef.close()
        }
      })

    }
  }
}
