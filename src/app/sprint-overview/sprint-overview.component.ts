import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-sprint-overview',
  templateUrl: './sprint-overview.component.html',
  styleUrls: ['./sprint-overview.component.css']
})
export class SprintOverviewComponent implements OnInit {

  isNew:boolean=false;
  id:number;
  slogan:string;
  startDate:string;
  endDate:string;

  constructor(public api: ApiAgentService, public route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const spid = Number(params.get('id'));
      if (spid != 0) {
        this.api.getSprint(this.api.currentProjectId, spid).then(data => {
          this.id = data.id;
          this.slogan = data.slogan;
          this.startDate = data.startDate;
          this.endDate = data.endDate;
          this.isNew = false;
        });
      } else {
          this.isNew = true;
          this.clear();
      }
    });
  }

  create():void {
    this.api.createSprint(this.api.currentProject.id, this.constructRequestObject(true)).then(response => {
      this.api.getProjectSprint(this.api.currentProject.id);
      this.reset();
    });
  }

  update():void {
    this.api.updateSprintRequest(this.constructRequestObject(false)).then(response => {
      this.api.getProjectSprint(this.api.currentProject.id);
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
    var sprintObject = {
      slogan: this.slogan,
      startDate: this.startDate,
      endDate: this.endDate
    };
    if (!isNew) {
      sprintObject['id'] = this.id;
    }
    return sprintObject;
  }

}
