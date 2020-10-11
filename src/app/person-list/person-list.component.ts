import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';
import { PersonFormComponent } from '../person-form/person-form.component';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {





  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.api.getProjectPerson(Number(params.get('id'))).then(data => {

      })
    })
  }

  deleteDeveloper(pid): void {
    this.api.deletePerson(pid).then(response => {
      window.location.reload()
    });
  }

  showDeveloper(pid): void {
    const dialogRef = this.dialog.open(PersonFormComponent, {
      data: { id: pid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.getProjectPerson(this.api.currentProjectId);
    });
  }
}