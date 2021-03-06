import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './api-agent.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
type requestAction = (id: number) => Promise<any>;

//to do 0. api service 1. display individual info and update form  2. form for multiple submit button  3. board 4. chart
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(public api: ApiAgentService, private location: Location, public activatedRoute: ActivatedRoute, public router: Router,
    public cd: ChangeDetectorRef) {
    this.api.getAllProject();
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (this.requests[this.view]) {
          let queryParams = router.parseUrl(e.url).queryParams
          let id = queryParams.pjid ? Number(queryParams.pjid) : Number(queryParams.id)
          this.requests[this.view](id);
        }
        else {
          this.api.getAllProject();
        }
        this.cd.detectChanges();
      }
    })
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

  get view(): string {
    for (let view in this.routes) {
      if (this.router.url.split('/')[this.router.url.split('/').length - 1].split('?')[0] == this.routes[view])
        return view
    }
    return "root"
  }
  back() {
    this.location.back()
  }

  routes: { [view: string]: string } = {
    "root": "home",
    "project": "project-overview",
    "person": "person-list",
    "chart": "chart",
    "sprint": "sprint-overview",
    "story": "sprint-backlog",
    "board": "board",
    "branch2sprint": "sprint-home"
  }

  requests: { [view: string]: requestAction } = {
    "root": null,
    "project": null,
    "person": null,
    "chart": null,
    "sprint": this.api.getProjectSprint,
    "story": this.api.getProjectSprint,
    "board": this.api.getProjectSprint,
    "branch2sprint": this.api.getProjectSprint,
  }


  ngOnInit() {
    this.api.getAllProject();
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

  getAllProject() {
    this.api.getAllProject();
  }
  sideNavToggle

  searchingString

}
