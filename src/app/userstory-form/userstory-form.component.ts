import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-userstory-form',
  templateUrl: './userstory-form.component.html',
  styleUrls: ['./userstory-form.component.css']
})
export class UserstoryFormComponent implements OnInit {



  constructor(public api: ApiAgentService, public dialogRef: MatDialogRef<UserstoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  unassignedBacklogs
  ngOnInit(): void {
    this.api.getProjectUnassignedBacklog().then(backlogs => {
      this.unassignedBacklogs = backlogs
      if (this.data.id != 'create') {
        this.api.getStory(this.data.id).then(story => {
          console.log(story)
          this.form = new FormGroup({       
            acceptanceTest: new FormControl({ value: story.acceptanceTest, disabled: false }, Validators.required),
            productBacklogId: new FormControl({ value: story.productBacklogId, disabled: false }, Validators.required),
          })
          this.dummyForm = new FormGroup({
            id: new FormControl({ value: story.id, disabled: false }),
            creationDate: new FormControl({ value: new Date(story.creationDate), disabled: false }),
          })
        })
      }
      else {
        this.isNew = true;
        this.edit = true;
        this.form = new FormGroup({
          acceptanceTest: new FormControl({ value: '', disabled: false }, Validators.required),
          productBacklogId: new FormControl({ value: '', disabled: false }, Validators.required),
        })
        this.dummyForm = new FormGroup({
          id: new FormControl({ value: '', disabled: false }),
          creationDate: new FormControl({ value: null, disabled: false }),
        })
      }
    })

  }
  form: FormGroup
  dummyForm: FormGroup
  edit = false
  isNew = false
  submitForm() {
    if (this.form.valid) {
      let body = { ...this.form.value, ...this.dummyForm.value }
      let dp = new DatePipe('en-US')
      Object.keys(body).forEach((key) => {
        if ((body[key] == null || body[key] == '')) { delete body[key] }
        if (body[key] instanceof Date) body[key] = dp.transform(body[key], 'dd.MM.yyyy HH:mm:ss')
      });
      if (this.isNew) {
        this.api.createStory(this.api.currentSprintId, body).then(result => {
          this.dialogRef.close()
        })
      }
      else {
        this.api.updateStory(body).then(result => {
          this.dialogRef.close()
        })
      }


    }
  }
  // ngOnInit(): void {
  //   if (!this.isNew) {
  //     this.api.getStory(this.id).then(response => {
  //       this.clear();

  //       this.name = response.name;
  //       this.priority = response.priority;
  //       this.estimatedSize = response.estimatedSize;
  //       this.acceptanceTest = response.acceptanceTest;
  //       this.creationDate = response.creationDate;
  //       this.cd.detectChanges()
  //     })
  //   } else {
  //     this.clear();
  //   }
  // }

  // reset(): void {
  //   window.location.reload()
  // }

  // clear(): void {
  //   this.id = null;
  //   this.name = null;
  //   this.priority = null;
  //   this.estimatedSize = null;
  //   this.acceptanceTest = null;
  //   this.creationDate = null;
  // }

  // create(): void {
  //   this.api.createStory(this.spid, this.constructRequestObject(true)).then(response => {
  //     this.api.getSprintStory(this.spid).then(data => {
  //     })
  //     this.isNew = false;
  //   });
  // }

  // update(): void {
  //   this.api.updateStory(this.constructRequestObject(false)).then(response => {
  //     window.location.reload()
  //   });
  // }

  // constructRequestObject(isNew: boolean): any {
  //   var storyRequestObject = {
  //     name: this.name,
  //     priority: this.priority,
  //     estimatedSize: this.estimatedSize,
  //     acceptanceTest: this.acceptanceTest
  //   };
  //   if (!isNew) {
  //     storyRequestObject['id'] = this.id;
  //     storyRequestObject['creationDate'] = this.creationDate;
  //   }
  //   return storyRequestObject;
  // }

}