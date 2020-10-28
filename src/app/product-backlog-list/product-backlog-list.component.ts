import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';
import { ProductBacklogFormComponent } from '../product-backlog-form/product-backlog-form.component';

@Component({
  selector: 'app-product-backlog-list',
  templateUrl: './product-backlog-list.component.html',
  styleUrls: ['./product-backlog-list.component.css']
})
export class ProductBacklogListComponent implements OnInit {

  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router,
    public dialog: MatDialog, public snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.api.getProjectBacklog(Number(params.get('id'))).then(data => {

      })
    })
  }

  deleteBacklog(pid): void {
    let person = this.api.persons.filter(p => p.id == pid)[0]
    let snackBarRef = this.snackBar.open('Are you sure to delete "' + person.firstName + " " + person.lastName + '"?', 'sure', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.api.deleteBacklog(pid).then(response => {
        this.api.getProjectBacklog(this.api.currentProjectId);
      });
    })
  }

  showBacklog(pid): void {
    const dialogRef = this.dialog.open(ProductBacklogFormComponent, {
      data: { id: pid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.getProjectBacklog(this.api.currentProjectId);
    });
  }

}
