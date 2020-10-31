import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute,
    public router: Router, public location: Location, public snackBar: MatSnackBar) {
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
            startDate: new FormControl({ value: new Date(data.startDate), disabled: false }, Validators.required)
          })
          this.dummyForm = new FormGroup({
            creationDate: new FormControl({ value: new Date(data.creationDate), disabled: false }),
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
          startDate: new FormControl({ value: new Date(), disabled: false }, Validators.required)
        })
        this.dummyForm = new FormGroup({
          creationDate: new FormControl({ disabled: false }),
          id: new FormControl({ disabled: false }),
        })
      }

    });
  }


  create(): void {
    if (this.form.valid) {
      let body = { ...this.form.value }
      let dp = new DatePipe('en-US')
      Object.keys(body).forEach((key) => {
        if ((body[key] == null || body[key] == '')) { delete body[key] }
      });
      body.creationDate = dp.transform(body.creationDate, 'dd.MM.yyyy HH:mm:ss')
      body.startDate = dp.transform(body.startDate, 'dd.MM.yyyy')
      this.api.createProject(body).then(response => {
        this.api.getAllProject();
        this.location.back();
      });
    }

  }

  update(): void {
    let body = { ...this.dummyForm.value, ...this.form.value }
    let dp = new DatePipe('en-US')
    Object.keys(body).forEach((key) => {
      if ((body[key] == null || body[key] == '')) { delete body[key] }
    });
    body.creationDate = dp.transform(body.creationDate, 'dd.MM.yyyy HH:mm:ss')
    body.startDate = dp.transform(body.startDate, 'dd.MM.yyyy')
    this.api.updateProject(body).then(response => {
      window.location.reload();
    });
  }





  removeProject(pjid) {
    let project = this.api.projects.filter(s => s.id == pjid)[0]
    let snackBarRef = this.snackBar.open('Are you sure to delete "' + project.name + '"?', 'sure', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.api.deleteProject(pjid);
      this.router.navigate(['/'])
    })
  }
}