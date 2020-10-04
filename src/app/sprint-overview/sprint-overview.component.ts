import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-sprint-overview',
  templateUrl: './sprint-overview.component.html',
  styleUrls: ['./sprint-overview.component.css']
})
export class SprintOverviewComponent implements OnInit {

  constructor(public api: ApiAgentService) { }

  ngOnInit(): void {
  }

}
