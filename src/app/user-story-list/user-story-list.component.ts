import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';
import { UserstoryFormComponent } from '../userstory-form/userstory-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-story-list',
  templateUrl: './user-story-list.component.html',
  styleUrls: ['./user-story-list.component.css']
})
export class UserStoryListComponent implements OnInit {
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute,
    public router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.api.getSprintStory(Number(params.get('id'))).then(data => {

      })
    })
  }
  storyStyle(story) {
    let style = {}
    if (story.id && this.api.currentStory && story.id == this.api.currentStory.id) style["background-color"] = 'greenyellow'

    return style;
  }



  deleteUserStory(sid): void {
    let story = this.api.stories.filter(s => s.id == sid)[0]
    let snackBarRef = this.snackBar.open('Are you sure to delete "' + story.name + '"?', 'sure', { duration: 5000 });
    snackBarRef.onAction().subscribe(() => {
      this.api.deleteStory(sid).then(response => {
        this.api.getSprintStory(this.api.currentSprint.id);
      });
    })
  }

  showUserStory(uid): void {
    const dialogRef = this.dialog.open(UserstoryFormComponent, {
      data: { id: uid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.getSprintStory(this.api.currentSprint.id);
    });
  }
}