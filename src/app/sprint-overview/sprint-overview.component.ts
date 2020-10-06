import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-sprint-overview',
  templateUrl: './sprint-overview.component.html',
  styleUrls: ['./sprint-overview.component.css']
})
export class SprintOverviewComponent implements OnInit {

  isNew:boolean;
  id:number;
  slogan:string;
  startDate:string;
  endDate:string;

  constructor(public api: ApiAgentService, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('init');
      let id = params.get('id');
      console.log(id);
      if (id != 'new') {
        this.api.getSprint(Number(id)).then(data => {
          console.log("asd");
          this.id = data.id;
          this.slogan = data.slogan;
          this.startDate = data.startDate;
          this.endDate = data.endDate;
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
      console.log(response);
      this.reset();
    });
  }

  reset():void {
    this.ngOnInit();
  }

  clear():void {
    this.id = null;
    this.slogan = null;
    this.startDate = null;
    this.endDate = null;
  }

  constructRequestObject(isNew:boolean):any {
    var sprintObject = {slogan:this.slogan};
    if (!isNew) {
      sprintObject['id'] = this.id;
      sprintObject['startDate'] = this.startDate;
      sprintObject['endDate'] = this.endDate;

    }
    return sprintObject;
  }

}
