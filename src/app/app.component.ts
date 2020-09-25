import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiAgentService } from './api-agent.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//to do 0. api service 1. display individual info and update form  2. form for multiple submit button  3. board 4. chart
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-scrumit';
  haveEntry() {
    switch (this.view) {
      case 'root':
        return this.api.projects != null;
      case 'project':
        return this.api.projects != null;
      case 'person':
        return this.api.projects != null;
      case 'chart':
        return this.api.projects != null;
      case 'branch2sprint':
        return this.api.sprints[this.currentProjectId] != null;
      case 'sprint':
        return this.api.sprints[this.currentProjectId] != null;
      case 'story':
        return this.api.sprints[this.currentProjectId] != null;
      case 'board':
        return true;
      default:
        return false;
    }
  }
  haveContent() {
    switch (this.view) {
      case 'root':
        return true;
      case 'project':
        return true;
      case 'person':
        return this.api.persons[this.currentProjectId] != null;
      case 'chart':
        return true; //implement
      case 'branch2sprint':
        return true
      case 'sprint':
        return true;
      case 'story':
        return this.api.stories[this.currentSprintId] != null;
      case 'board':
        return this.api.tasks[this.currentSprintId] != null;
      default:
        return false;
    }
  }


  currentTitle() {
    let s: String = '';
    if (this.currentProjectId) {
      s = s +
        "project: " + this.api.projects.filter(pj => pj.id == this.currentProjectId)[0].name;
      if (this.currentSprintId) {
        s = s +
          " - Sprint: " + this.api.sprints[this.currentProjectId].filter(pj => pj.id == this.currentSprintId)[0].slogan;
      }
    }



    return s;
  }

  currentProjectId = null;
  currentSprintId = null;
  currentPersonId = null;
  currentStoryId = null;
  currentTaskId = null;

  sideNavToggle = false;
  _view: string[] = new Array("root");
  get view(): string {

    return this._view[this._view.length - 1];

  }
  set view(state: string) {
    this.states.forEach((substate, index) => {
      if (substate.includes(state)) {
        while (this._view.length > index) this._view.pop();
        while (this._view.length < index)
          this._view.push(this.states[this._view.length][0]);

        this._view.push(state);
      }
    })
  }
  states: Array<Array<string>> = [["root"], ["project", "person", "chart"], ["branch2sprint", "sprint", "story"], ["board"]]
  constructor(private api: ApiAgentService) {
    this.api.getAllProject();
  }
  ngOnInit() {
    this.projectForm.disable();
  }


  back() {
    if (this._view.length > 1) {
      this._view.pop();
      switch (this._view.length) {
        case 1:
          this.currentProjectId = null;
          this.currentPersonId = null;
        case 2:
          this.currentSprintId = null;
          this.currentStoryId = null;
        case 3:
          this.currentTaskId = null;

      }
    }
  }

  projectStyle(project) {
    let style = {}
    if (project.id && project.id == this.currentProjectId) style["background-color"] = 'greenyellow'

    return style;
  }
  sprintStyle(sprint) {
    let style = {}
    if (sprint.id && sprint.id == this.currentSprintId) style["background-color"] = 'greenyellow'

    return style;
  }
  personStyle(person) {
    let style = {}
    if (person.id && person.id == this.currentPersonId) style["background-color"] = 'greenyellow'

    return style;
  }
  storyStyle(story) {
    let style = {}
    if (story.id && story.id == this.currentStoryId) style["background-color"] = 'greenyellow'

    return style;
  }
  storyBoardStyle(story) {

  }
  taskBoardStyle(task) {

  }

  getAllProject() {
    this.api.getAllProject();
  }
  getProject(pjid) {
    this.api.getProject(pjid).then(data => {
      this.view = 'project';
      this.currentProjectId = pjid;
    })
  }

  getAllPerson(pjid: number) {
    this.currentProjectId = pjid;
    this.api.getAllPerson(pjid).then(data => {
      this.view = 'person'
    })
  }
  getSprintAll(pjid: number) {
    this.currentProjectId = pjid;
    this.api.getSprintAll(pjid).then(data => {
      this.view = 'branch2sprint'
    })
  }
  getAllStory(spid: number) {
    this.currentSprintId = spid;
    this.api.getAllStory(spid).then(data => {
      this.view = 'story'
    })


  }

  getAllTask(spid: number) {
    this.sideNavToggle = false;
    this.currentSprintId = spid;
    this.api.getAllTask(spid).then(data => {
      this.view = 'board'
      console.log(data);
    })
  }
  filter(objs, id) {
    return objs.filter(o => o.id == id)
  }

  projectForm = new FormGroup({
    id: new FormControl( ),
    name: new FormControl(),
    description: new FormControl(),
    creation: new FormControl()
  });
}
