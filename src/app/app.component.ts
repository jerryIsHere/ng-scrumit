import { Component, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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
        return this.costLineChart != null;
      case 'branch2sprint':
        return true
      case 'sprint':
        return true;
      case 'story':
        return this.api.stories != null;
      case 'board':
        return this.api.tasks != null;
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
          " - Sprint: " + this.api.sprints.filter(pj => pj.id == this.currentSprintId)[0].slogan;
      }
    }



    return s;
  }

  _currentProjectId = null;
  get currentProjectId(): number {
    return this._currentProjectId;
  }
  set currentProjectId(id: number) {
    if (this._currentProjectId != id) {
      this.api.persons = new Array<any>();
      this.api.sprints = new Array<any>();
      this.api.stories = new Array<any>();
      this.api.tasks = new Array<any>();
      this.api.issues = new Array<any>();
    }
    this._currentProjectId = id;
  }

  _currentSprintId = null;
  get currentSprintId(): number {
    return this._currentSprintId;
  }
  set currentSprintId(id: number) {
    if (this._currentSprintId != id) {
      this.api.stories = new Array<any>();
      this.api.tasks = new Array<any>();
      this.api.issues = new Array<any>();
    }
    this._currentSprintId = id;
  }

  _currentPersonId = null;
  get currentPersonId(): number {
    return this._currentPersonId;
  }
  set currentPersonId(id: number) {
    this._currentPersonId = id;
  }

  _currentStoryId = null;
  get currentStoryId(): number {

    return this._currentStoryId;
  }
  set currentStoryId(id: number) {
    if (this._currentStoryId != id) {
      this.api.tasks = new Array<any>();
      this.api.issues = new Array<any>();
    }
    this._currentStoryId = id;
  }

  _currentTaskId = null;
  get currentTaskId(): number {
    return this._currentTaskId;
  }
  set currentTaskId(id: number) {
    this._currentTaskId = id;
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
          this.currentPersonId = null;
          if (this.view == 'root') this.currentProjectId = null;
        case 2:
          this.currentSprintId = null;
          this.currentStoryId = null;
        case 3:
          this.currentTaskId = null;
      }
    }
    else {
      this.view = "root";
      this.currentProjectId = null;
      this.currentPersonId = null;
      this.currentSprintId = null;
      this.currentStoryId = null;
      this.currentTaskId = null;

      this.api.persons = null;
      this.api.sprints = null;
      this.api.stories = null;
      this.api.tasks = null;
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
    let style = {}
    if (task.status == 3) {
      style["border-color"] = "lightblue"
      style["border-style"] = "solid";
    }
    else if (task.status == 2) {
      style["border-color"] = "pink"
      style["border-style"] = "solid";
    }
    return style;
  }

  getAllProject() {
    this.api.getAllProject();
  }
  getProject(pjid) {
    this.view = 'project';
    this.api.getProject(pjid).then(data => {
      this.currentProjectId = pjid;
    })
  }

  getProjectPerson(pjid: number) {
    this.currentProjectId = pjid;
    this.view = 'person'
    this.api.getProjectPerson(pjid).then(data => {

    })
  }

  getChart(pjid: number) {
    this.costLineChart = null;
    this.view = 'chart'
    this.currentProjectId = pjid;
    let slope = {};
    this.api.getProject(pjid).then(project => {
      let data = [{
        name: "initial expectation",
        series: [
          {
            name: 0,
            value: 0,
          },
          {
            name: project.duration,
            value: project.duration * project.cost
          }
        ]
      }]
      slope[0] = project.cost
      this.api.getProjectIssue(pjid).then(issues => {
        let overTime = 0
        let titleDict: { [description: string]: number } = {};

        for (let issue of issues) {
          overTime = overTime + issue.duration
        }
        slope[project.duration + overTime] = 0;
        for (let issue of issues) {
          console.log()
          let title = issue.description
          let i = 0;
          while (titleDict.hasOwnProperty(title)) {
            i++;
            title = issue.description + ' (' + i + ')';
          }
          titleDict[title] = issue.id;
          data.push({
            name: title,
            series: [
              {
                name: issue.hourElapsed,
                value: 0
              },
              {
                name: project.duration + overTime,
                value: (project.duration + overTime) * issue.cost
              }
            ]
          })
          if (slope.hasOwnProperty(issue.hourElapsed)) {
            slope[issue.hourElapsed] = slope[issue.hourElapsed] + issue.cost
          }
          else {
            slope[issue.hourElapsed] = issue.cost
          }
        }
        let total = {
          name: "forcast",
          series: []
        }

        let cummulativeSlope = 0;
        let cummulativeCost = 0;
        console.log(slope)
        for (let time in slope) {
          cummulativeCost = cummulativeSlope * parseInt(time)
          cummulativeSlope = cummulativeSlope + slope[time]
          total.series.push({ name: parseInt(time), value: cummulativeCost })

        }
        this.costLineChartTitleId = titleDict;
        console.log(this.costLineChartTitleId)
        data.push(total);
        this.costLineChart = data;



      })
    })

  }
  getProjectSprint(pjid: number) {
    this.currentProjectId = pjid;
    this.api.getProjectSprint(pjid).then(data => {
      this.view = 'branch2sprint'
    })
  }
  getSprintStory(spid: number) {
    this.currentSprintId = spid;
    this.api.getSprintStory(spid).then(data => {
      this.view = 'story'
    })
  }

  getSprintTask(spid: number) {
    this.sideNavToggle = false;
    this.currentSprintId = spid;
    this.openDragList = []
    this.inProgressDragList = []
    this.doneDragList = []
    if (!this.api.persons || this.api.persons.length == 0) {
      this.api.getProjectPerson(this.currentProjectId).then(data => {
        this.commitGetTask(spid);
      })
    }
    else {
      this.commitGetTask(spid);
    }


  }
  commitGetTask(spid: number) {
    this.api.getSprintTask(spid).then(data => {
      this.view = 'board'
      for (let tasks of data) {
        for (let task of tasks) {
          if (task.status == 0) {
            this.openDragList.push(task)
          }
          else if (task.status == 4) {
            this.doneDragList.push(task)
          }
          else {
            this.inProgressDragList.push(task)
          }
        }
      }
      this.openDragList.sort((a, b) => a.order - b.order)
      this.inProgressDragList.sort((a, b) => a.order - b.order)
      this.doneDragList.sort((a, b) => a.order - b.order)
    })
  }
  filter(objs, key, values) {
    if (typeof values == 'number') {
      return objs.filter(o => o[key] == values)
    }
    if (Array.isArray(values)) {
      return objs.filter(o => values.includes(o[key]))
    }
    return []

  }


  projectForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
    creation: new FormControl()
  });

  costLineChart
  costLineChartTitleId

  openDragList = []
  inProgressDragList = []
  doneDragList = []



  drop(event: CdkDragDrop<string[]>) {
    console.log(event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  release(event: CdkDragDrop<string[]>, status) {
    if (this.selectedTask == null) return;
    this.api.tasks.reduce((acc, val) => acc.concat(val), []).filter(task => task.id == this.selectedTask)[0].status = status;
  }
  selectedTask
  mouseOverTask(id) {
    this.selectedTask = id
  }
}
