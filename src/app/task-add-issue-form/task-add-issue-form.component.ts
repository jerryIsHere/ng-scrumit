import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-task-add-issue-form',
  templateUrl: './task-add-issue-form.component.html',
  styleUrls: ['./task-add-issue-form.component.css']
})
export class TaskAddIssueFormComponent implements OnInit {

  constructor(public api: ApiAgentService,
    public dialogRef: MatDialogRef<TaskAddIssueFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
  }
  form = new FormGroup({
    description: new FormControl('', Validators.required)
  })
  submitForm() {
    if (this.form.valid) {
      this.api.postTaskIssue(this.data.id, this.form.value).then(result => {
        if (result) {
          this.dialogRef.close()
        }
      })

    }
  }
}
