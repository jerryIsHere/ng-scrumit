import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router }  from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-sprint-home',
  templateUrl: './sprint-home.component.html',
  styleUrls: ['./sprint-home.component.css']
})
export class SprintHomeComponent implements OnInit {

  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit() {
  }

}
