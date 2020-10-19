import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';

@Component({
  selector: 'app-sprint-overview',
  templateUrl: './sprint-overview.component.html',
  styleUrls: ['./sprint-overview.component.css']
})
export class SprintOverviewComponent implements OnInit {

  form: FormGroup
  dummyForm: FormGroup
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router, public location: Location) {
  }
  isNew
  edit
  pjid
  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const id = params.get('id')
      this.pjid = Number(params.get('pjid'));
      if (id != 'create') {
        this.isNew = false;
        this.edit = false;
        this.api.getSprint(Number(id)).then(data => {
          this.form = new FormGroup({
            slogan: new FormControl({ value: data.slogan, disabled: false }, Validators.required),
            endHour: new FormControl({ value: data.endHour, disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
          })
          this.dummyForm = new FormGroup({
            id: new FormControl({ value: data.id, disabled: false }),
          })
        });
      } else {
        this.api.currentSprintId = null;
        this.isNew = true;
        this.edit = true;
        this.form = new FormGroup({
          slogan: new FormControl({ value: '', disabled: false }, Validators.required),
          endHour: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.pattern("^[0-9]*$")]),
        })
        this.dummyForm = new FormGroup({
          id: new FormControl({ value: '', disabled: false }),
        })
      }
    });
  }

  create(): void {
    this.api.createSprint(this.pjid, this.form.value).then(response => {
      this.location.back()
    });
  }

  update(): void {
    console.log({ ...this.form.value, ...this.dummyForm.value })
    this.api.updateSprintRequest({ ...this.form.value, ...this.dummyForm.value }).then(response => {

      window.location.reload();
    });
  }
  dateVlidation() {
    return ((control: AbstractControl) => {
      if (this.dummyForm && this.dummyForm.get('startDate').value && this.dummyForm.get('endDate').value) {
        let startDate: Date = this.dummyForm.get('startDate').value
        let endDate: Date = this.dummyForm.get('endDate').value
        if (endDate.getTime() - startDate.getTime() < 86400000) {
          return { startEndDateInvalid: true };
        }
        else {
          return null
        }
      }
      return null
    })
  }
  removeSprint(spid) {
    this.api.deleteSprint(spid);
    this.router.navigate(['/sprint-home'], { queryParams: { id: this.api.currentProjectId } })
  }

}