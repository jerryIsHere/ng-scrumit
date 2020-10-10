import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-user-story-list',
  templateUrl: './user-story-list.component.html',
  styleUrls: ['./user-story-list.component.css']
})
export class UserStoryListComponent implements OnInit {

  isShowUserStoryForm:boolean;
  isNewUserStoryForm:boolean;
  spid:number;
  uid:number;

  constructor(public api: ApiAgentService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.api.getSprintStory(Number(params.get('id'))).then(data => {
        this.isShowUserStoryForm = false;
        this.spid = Number(params.get('id'));
      })
    })
  }
  storyStyle(story) {
    let style = {}
    if (story.id && this.api.currentStory && story.id == this.api.currentStory.id) style["background-color"] = 'greenyellow'

    return style;
  }

  addUserStory():void {
    console.log('add developer');
    this.isShowUserStoryForm = true;
    this.isNewUserStoryForm = true;
  }

  deleteUserStory(sid):void {
    console.log('delete User Story');
    this.api.deleteStory(sid).then(response => {
      this.ngOnInit();
    });
  }

  showUserStory(uid):void {
    this.isShowUserStoryForm = false;
    this.uid = uid;
    this.isShowUserStoryForm = true;
    this.isNewUserStoryForm = false;
  }
}
