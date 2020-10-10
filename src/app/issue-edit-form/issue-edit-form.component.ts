import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-issue-edit-form',
  templateUrl: './issue-edit-form.component.html',
  styleUrls: ['./issue-edit-form.component.css']
})
export class IssueEditFormComponent implements OnInit {


  constructor(public api: ApiAgentService,
    public dialogRef: MatDialogRef<IssueEditFormComponent>, public cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    let issue = this.api.issues.filter(issue => issue.id == this.data.id)[0]
    this.form = new FormGroup({
      description: new FormControl({ value: issue.description, disabled: true }, Validators.required),
      commencement: new FormControl({ value: issue.commencement, disabled: true }, Validators.min(0)),
      cost: new FormControl({ value: issue.cost, disabled: true }, Validators.min(0)),
      category: new FormControl({ value: issue.category, disabled: true })
    })
    this.dummyForm = new FormGroup({
      creation: new FormControl({ value: new Date(issue.creationDate), disabled: true }),
      id: new FormControl({ value: issue.id, disabled: true }),
      duration: new FormControl({ value: issue.duration, disabled: true })
    })
  }
  form: FormGroup
  dummyForm: FormGroup
  edit = false
  submitForm() {
    if (this.form.valid) {
      this.api.patchIssue(this.data.id, this.form.value).then(result => {
        if (result) {
          this.dialogRef.close()
        }
      })

    }
  }
  assignCat(event) {
    if (!(this.form.get('category').value as Array<string>).includes(event.value)) {
      this.form.get('category').value.push(event.value);
      this.form.get('category').updateValueAndValidity()
      this.cd.detectChanges()
    }
    if (event.input) {
      event.input.value = ''
    }
  }
  removeCat(cat: string) {
    this.form.get('category').setValue((this.form.get('category').value as Array<string>).filter(str =>
      str != cat))
    this.form.get('category').updateValueAndValidity()
    this.cd.detectChanges()
  }
}
