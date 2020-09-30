import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';


@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  constructor(public api:ApiAgentService) { }

  ngOnInit(): void {
  }

}
