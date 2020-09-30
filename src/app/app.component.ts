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
        return this.costLineChart != null;
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

  getChart(pjid: number) {
    this.costLineChart = null;
    this.view = 'chart'

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
        for (let time in slope) {
          cummulativeCost = cummulativeSlope * parseInt(time)
          cummulativeSlope = cummulativeSlope + slope[time]
          total.series.push({ name: parseInt(time), value: cummulativeCost })

        }
        this.costLineChartTitleId = titleDict;
        data.push(total);
        this.costLineChart = data;



      })
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



  // projectForm = new FormGroup({
  //   id: new FormControl(),
  //   name: new FormControl(),
  //   description: new FormControl(),
  //   creation: new FormControl()
  // });

  costLineChart
  costLineChartTitleId






}
