import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  id:number;
  name:string;
  description:string;
  creationDate:string;
  isNew:boolean=false;

  constructor(public api: ApiAgentService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = Number(params.get('id'));
      console.log(id);
      if (id != 0) {
        this.api.getProject(Number(id)).then(data => {
          this.id = data.id;
          this.name = data.name;
          this.description = data.description;
          this.creationDate = data.creationDate;
          this.isNew = false;
        });
      } else {
          this.isNew = true;
          this.api.currentProjectId = null;
          this.clear();
      }

    });
  }


  create():void {
    this.api.createProject(this.constructRequestObject(true)).then(response => {
      this.api.getAllProject();
      this.reset();
    });
  }

  update():void {
    this.api.updateProject(this.constructRequestObject(false)).then(response => {
      this.reset();
    });
  }

  reset():void {
    this.ngOnInit();
  }

  clear():void {
    this.id = null;
    this.name = null;
    this.description = null;
    this.creationDate = null;
  }

  constructRequestObject(isNew:boolean):any {
    var projectRequestObject = {
      name: this.name,
      description: this.description
    };
    if (!isNew) {
      projectRequestObject['id'] = this.id;
      projectRequestObject['creationDate'] = this.creationDate;
    }
    console.log(projectRequestObject);
    return projectRequestObject;
  }
}
