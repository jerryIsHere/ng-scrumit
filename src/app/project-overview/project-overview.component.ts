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
      console.log('init');
      let id = params.get('id');
      console.log(id);
      if (id != 'new') {
        this.api.getProject(Number(id)).then(data => {
          console.log("asd");
          this.id = data.id;
          this.name = data.name;
          this.description = data.description;
          this.creationDate = data.creationDate;
          this.isNew = false;
        });
      } else {
          console.log('new');
          this.isNew = true;
          this.clear();
      }

    });
  }


  create():void {
    this.api.createProject(this.constructRequestObject(true)).then(response => {
      this.api.getAllProject();
    })
  }

  update():void {
    this.api.updateProject(this.constructRequestObject(false)).then(response => {
      this.reset();
      console.log("updated success");
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
    var projectRequestObject = {name:this.name, description:this.description};
    if (!isNew) {
      projectRequestObject['id'] = this.id;
      projectRequestObject['creationDate'] = this.creationDate;
    }
    return projectRequestObject;
  }
}
