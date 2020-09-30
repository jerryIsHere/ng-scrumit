import { Component, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './api-agent.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


//to do 0. api service 1. display individual info and update form  2. form for multiple submit button  3. board 4. chart
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(public api: ApiAgentService) {
    this.api.getAllProject();
  }

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
        return this.api.sprints != null;
      case 'sprint':
        return this.api.sprints != null;
      case 'story':
        return this.api.sprints != null;
      case 'board':
        return this.api.sprints != null;
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
        return this.api.persons != null;
      case 'chart':
        return true;
      case 'branch2sprint':
        return true
      case 'sprint':
        return true;
      case 'story':
        return this.api.stories != null;
      case 'board':
        return true;
      default:
        return false;
    }
  }


  Title() {
    let s: String = '';
    if (this.api.currentProject) {
      s = s +
        "project: " + this.api.currentProject.name;
      if (this.api.currentSprint) {
        s = s +
          " - Sprint: " + this.api.currentSprint.slogan;
      }
    }



    return s;
  }




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
  states: Array<Array<string>> = [["root", "project", "person", "chart"], ["branch2sprint", "sprint", "story"], ["board"]]

  ngOnInit() {

  }


  back() {
    if (this._view.length > 1) {
      this._view.pop();
      switch (this._view.length) {
        case 1:

        case 2:

        case 3:

      }
    }
    else {
      this.view = "root";
    }
  }

  projectStyle(project) {
    if (this.view == "root") return {};
    let style = {}
    if (project.id && this.api.currentProject && project.id == this.api.currentProject.id) style["background-color"] = 'greenyellow'

    return style;
  }
  sprintStyle(sprint) {
    if (this.view == "branch2sprint") return {};
    let style = {}
    if (sprint.id && this.api.currentSprint && sprint.id == this.api.currentSprint.id) style["background-color"] = 'greenyellow'

    return style;
  }
  personStyle(person) {
    let style = {}
    if (person.id && this.api.currentPerson && person.id == this.api.currentPerson.id) style["background-color"] = 'greenyellow'

    return style;
  }
  storyStyle(story) {
    let style = {}
    if (story.id && this.api.currentStory && story.id == this.api.currentStory.id) style["background-color"] = 'greenyellow'

    return style;
  }


  getAllProject() {
    this.api.getAllProject();
  }
  getProject(pjid) {
    this.view = 'project';
    this.api.getProject(pjid).then(data => {

    })
  }

  getProjectPerson(pjid: number) {

    this.view = 'person'
    this.api.getProjectPerson(pjid).then(data => {

    })
  }


  getProjectSprint(pjid: number) {

    this.api.getProjectSprint(pjid).then(data => {
      this.view = 'branch2sprint'
    })
  }
  getSprintStory(spid: number) {

    this.api.getSprintStory(spid).then(data => {
      this.view = 'story'
    })
  }

  getSprintTask(spid: number) {
    this.sideNavToggle = false;
    this.api.getSprintStory(spid).then(story => {
      this.view = 'board'
    })
  }

  getChart(pjid: number) {
    this.api.getProject(pjid).then(project => {
      this.view = 'chart'
    })
  }

  // projectForm = new FormGroup({
  //   id: new FormControl(),
  //   name: new FormControl(),
  //   description: new FormControl(),
  //   creation: new FormControl()
  // });







}
