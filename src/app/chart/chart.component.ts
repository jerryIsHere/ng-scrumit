import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';

 
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(public api: ApiAgentService) { }

  ngOnInit(): void {
  }

}
