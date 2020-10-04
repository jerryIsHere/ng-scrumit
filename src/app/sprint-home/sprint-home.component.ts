import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-sprint-home',
  templateUrl: './sprint-home.component.html',
  styleUrls: ['./sprint-home.component.css']
})
export class SprintHomeComponent implements OnInit {

  constructor(public api: ApiAgentService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.api.getProjectSprint(Number(params.get('id'))).then(data => {

      })
    })
  }

}
