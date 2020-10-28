import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-product-backlog-form',
  templateUrl: './product-backlog-form.component.html',
  styleUrls: ['./product-backlog-form.component.css']
})
export class ProductBacklogFormComponent implements OnInit {

  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<ProductBacklogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.id != 'create') {
      this.api.getPerson(this.data.id).then(backlog => {
        this.form = new FormGroup({
          name: new FormControl({ value: backlog.name, disabled: false }, Validators.required),
          description: new FormControl({ value: backlog.description, disabled: false }, [Validators.required]),
          priority: new FormControl({ value: backlog.priority, disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
          estimatedDuration: new FormControl({ value: backlog.estimatedDuration, disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
        })
        this.dummyForm = new FormGroup({
          id: new FormControl({ value: backlog.id, disabled: false }),
          creationDate: new FormControl({ value: new Date(backlog.creationDate), disabled: false }),
        })
      })
    }
    else {
      this.isNew = true;
      this.edit = true;
      this.form = new FormGroup({
        name: new FormControl({ value: '', disabled: false }, Validators.required),
        description: new FormControl({ value: '', disabled: false }, [Validators.required]),
        priority: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
        estimatedDuration: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
      })
      this.dummyForm = new FormGroup({
        id: new FormControl({ value: '', disabled: false }),
        creationDate: new FormControl({ value: '', disabled: false }),
      })
    }
  }
  form: FormGroup
  dummyForm: FormGroup
  edit = false
  isNew = false
  submitForm() {
    if (this.form.valid) {
      let body = { ...this.form.value, ...this.dummyForm.value }
      Object.keys(body).forEach((key) => { if (body[key] == null || body[key] == '') delete body[key] });
      if (this.isNew) {
        this.api.createBacklog(this.api.currentProjectId, body).then(result => {
          this.dialogRef.close()
        })
      }
      else {
        this.api.updateBacklog(body).then(result => {
          this.dialogRef.close()
        })
      }


    }
  }

}
