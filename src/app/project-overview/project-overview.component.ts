import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {


  form: FormGroup
  dummyForm: FormGroup
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router, public location: Location) {
  }
  isNew
  edit
  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      let id = params.get('id');
      if (id != 'create') {
        this.isNew = false;
        this.edit = false;
        this.api.getProject(Number(id)).then(data => {
          this.form = new FormGroup({
            name: new FormControl({ value: data.name, disabled: false }, Validators.required),
            description: new FormControl({ value: data.description, disabled: false }, Validators.required),
            cost: new FormControl({ value: data.cost, disabled: false }, Validators.min(0)),
          })
          this.dummyForm = new FormGroup({
            creation: new FormControl({ value: new Date(data.creationDate), disabled: false }),
            id: new FormControl({ value: data.id, disabled: false }),
          })

        });
      } else {
        this.api.currentProjectId = null;
        this.isNew = true;
        this.edit = true;
        this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          description: new FormControl('', Validators.required),
          cost: new FormControl('', Validators.min(0)),
        })
        this.dummyForm = new FormGroup({
          creation: new FormControl({ disabled: false }),
          id: new FormControl({ disabled: false }),
        })
      }

    });
  }


  create(): void {
    if (this.form.valid) {
      this.api.createProject(this.form.value).then(response => {
        this.api.getAllProject();
        this.location.back();
      });
    }

  }

  update(): void {
    this.api.updateProject({ ...this.dummyForm.value, ...this.form.value }).then(response => {
      window.location.reload();
    });
  }





  removeProject(pjid) {
    this.api.deleteProject(pjid);
    this.router.navigate(['/'])
  }
}