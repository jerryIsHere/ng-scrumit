import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  constructor(public api: ApiAgentService, public route: ActivatedRoute) {

  }
  projectForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    description: new FormControl(''),
    creation: new FormControl(''),
  }
  )
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(Number(params.get('id')))
      this.api.getProject(Number(params.get('id'))).then(data => {

      })
    })
  }
}
