import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  isShowPersonForm:boolean;
  isNewPersonForm:boolean;
  pjid:number;
  pid:number;

  constructor(public api: ApiAgentService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.api.getProjectPerson(Number(params.get('id'))).then(data => {
        this.isShowPersonForm = false;
        this.pjid = Number(params.get('id'));
      })
    })
  }

  addDeveloper():void {
    console.log('add developer');
    this.isShowPersonForm = true;
    this.isNewPersonForm = true;
  }

  deleteDeveloper(pid):void {
    console.log('delete developer');
    this.api.deletePerson(pid).then(response => {
      this.ngOnInit();
    });
  }

  showDeveloper(pid):void {
    this.isShowPersonForm = false;
    this.pid = pid;
    this.isShowPersonForm = true;
    this.isNewPersonForm = false;
  }
}
