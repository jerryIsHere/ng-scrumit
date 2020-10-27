import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {


  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.id != 'create') {
      this.api.getPerson(this.data.id).then(person => {
        this.form = new FormGroup({
          firstName: new FormControl({ value: person.firstName, disabled: false }, Validators.required),
          email: new FormControl({ value: person.email, disabled: false }, [Validators.required, Validators.email]),
          lastName: new FormControl({ value: person.lastName, disabled: false }, Validators.required)
        })
        this.dummyForm = new FormGroup({
          id: new FormControl({ value: person.id, disabled: false }),
        })
      })
    }
    else {
      this.isNew = true;
      this.edit = true;
      this.form = new FormGroup({
        firstName: new FormControl({ value: '', disabled: false }, Validators.required),
        email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        lastName: new FormControl({ value: '', disabled: false }, Validators.required)
      })
      this.dummyForm = new FormGroup({
        id: new FormControl({ value: '', disabled: false }),
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
        this.api.createPerson(this.api.currentProjectId, body).then(result => {
          this.dialogRef.close()
        })
      }
      else {
        this.api.updatePerson(body).then(result => {
          this.dialogRef.close()
        })
      }


    }
  }


}