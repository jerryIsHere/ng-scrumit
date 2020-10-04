import { Component, OnInit } from '@angular/core';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  constructor(public api:ApiAgentService) { }

  ngOnInit(): void {
  }

}
