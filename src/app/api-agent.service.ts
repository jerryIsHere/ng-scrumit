import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var dummy_relation = {
  'project': {
    "person": {
      1: [2, 3, 4], 2: [1] // one to m only???
    },
    "sprint": {
      1: [1], 2: []
    },
  },
  "sprint": {
    "story": {
      1: [1, 2]
    },
    "issue": {
      1: [1, 2]
    }
  },
  "story": {
    "task": {
      1: [1, 2, 3, 4],
      2: [5, 6, 7, 8]
    },
    "issue": {
      2: [1, 2]
    }
  },
  "task": {
    "issue": {
      1: [], 2: [], 3: [], 4: [], 7: [], 8: [],
      5: [1, 3],
      6: [2],
    }
  }
}
var dummy = {
  'projects': [
    {
      "creationDate": 1600863833000, "description": "trr", "name": "test project 2", "id": 2, "duration": 0, "cost": 400
    }, {
      "creationDate": 1600662795000, "description": "testing", "name": "test project arrr", "id": 1, "duration": 70, "cost": 400
    }
  ],
  'persons': [
    {
      "firstName": "Jerry", "lastName": "Chan", "email": "123@amail.com", "id": 1
    }, {
      "firstName": "Mary", "lastName": "Chan", "email": "456@amail.com", "id": 2
    }, {
      "firstName": "Kate", "lastName": "Chan", "email": "456@amail.com", "id": 3
    }, {
      "firstName": "Peter", "lastName": "Chan", "email": "456@amail.com", "id": 4
    }
  ],
  'sprints': [
    { "slogan": "demo", "startDate": 1600646400000, "endDate": 1600819200000, "id": 1 }
  ],
  'stories': [
    {
      "creationDate": null, "xCoord": 10, "yCoord": 6, "duration": 30, "acceptanceTest": null,
      "sprints": [], "tasks": [], "name": "test", "priority": 0, "id": 1
    },
    {
      "creationDate": null, "xCoord": 10, "yCoord": 27, "duration": 40, "acceptanceTest": null,
      "sprints": [], "tasks": [], "name": "test2", "priority": 0, "id": 2
    }
  ],
  'tasks': [// task have person & issue array
    { "creationDate": 1600669342000, "commencement": 50, "order": 1, "duration": 8, "description": "test-a1", "status": 0, "id": 1, "person": [] },
    { "creationDate": 1600671987000, "commencement": 50, "order": 2, "duration": 8, "description": "test-b", "status": 0, "id": 2, "person": [] },
    { "creationDate": 1600671141000, "commencement": 40, "order": 3, "duration": 8, "description": "test  by kenny", "status": 1, "id": 3, "person": [2] },
    { "creationDate": 1600692238000, "commencement": 40, "order": 4, "duration": 8, "description": "Test", "status": 1, "id": 4, "person": [2] },
    { "creationDate": 1600866624000, "commencement": 30, "order": 5, "duration": 8, "description": "problem 1", "status": 2, "id": 5, "person": [3, 4] },
    { "creationDate": 1600663046000, "commencement": 62, "order": 6, "duration": 8, "description": "problem 2", "status": 3, "id": 6, "person": [3,] },
    { "creationDate": 1600663046000, "commencement": 15, "order": 7, "duration": 8, "description": "New task...", "status": 4, "id": 7, "person": [2] },
    { "creationDate": 1600663046000, "commencement": 10, "order": 8, "duration": 8, "description": "New task...", "status": 4, "id": 8, "person": [4] },
  ],
  'issues': [
    { "creationDate": 1600671987000, "commencement": 45, "duration": 10, "cost": 300, "description": "assigne more developer", "category": ["resign", "recruit"], "id": 3 },
    { "creationDate": 1600669342000, "commencement": 70, "duration": 10, "cost": 0, "description": "extend deadline", "category": ["unexpected error"], "id": 2 },
    { "creationDate": 1600671987000, "commencement": 35, "duration": 5, "cost": 800, "description": "assigne more developer", "category": ["resign", "recruit"], "id": 1 },
  ]

}

@Injectable({
  providedIn: 'root'
})
export class ApiAgentService {
  projects: Array<any> = null;
  persons: Array<any> = null;
  sprints: Array<any> = null;
  stories: Array<any> = null;
  tasks: Array<any> = null;
  //issues: Array<any> = null;
  constructor(private http: HttpClient,) {

  }
  getAllProjectRequest = () => {
    return Promise.resolve(dummy["projects"])
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allprojects/").toPromise()
  }
  getAllProject = (): Promise<any> => {
    return this.getAllProjectRequest().then(projects => {
      this.projects = projects as Array<any>;
      return projects;
    })
  }
  getProjectRequest = (pjid) => {
    return Promise.resolve(dummy["projects"].filter(data => data.id == pjid)[0])
    return this.http.get("http://34.92.198.0:8080/scrumit/project/" + pjid + "/").toPromise()
  }
  getProject = (pjid = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectRequest(pjid).then(project => {
      this.projects.filter(pj => pj.id == pjid)[0] = project
      return project;
    })
  }


  getProjectPersonRequest = (pjid) => {
    return Promise.resolve(dummy["persons"].filter(data => (dummy_relation["project"]["person"][pjid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allpersons/" + pjid + "/").toPromise()
  }
  getProjectPerson = (pjid: number = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectPersonRequest(pjid).then(persons => {
      this.persons = persons as Array<any>;
      return persons
    })
  }

  getPersonRequest = (id) => {
    return Promise.resolve(dummy["persons"].filter(person => person.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/project/person/" + id + "/").toPromise()
  }
  getPerson = (id: number = this._currentPersonId): Promise<any> => {
    this.currentPersonId = id;
    return this.getPersonRequest(id).then(person => {
      this.persons.filter(p => p.id == id)[0] = person;
      return person
    })

  }

  getProjectSprintRequest = (pjid) => {
    return Promise.resolve(dummy["sprints"].filter(data => (dummy_relation["project"]["sprint"][pjid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/all/" + pjid + "/").toPromise()
  }
  getProjectSprint = (pjid: number = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectSprintRequest(pjid).then(sprints => {
      this.sprints = sprints as Array<any>;
      return sprints
    })
  }
  getSprintRequest = (id) => {
    return Promise.resolve(dummy["sprints"].filter(sprint => sprint.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/sprint/" + id + "/").toPromise()
  }
  getSprint = (id = this._currentSprintId): Promise<any> => {
    this.currentSprintId = id;
    return this.getSprintRequest(id).then(sprint => {
      this.sprints.filter(s => s.id == id)[0] = sprint;
      return sprint
    })
  }


  getSprintStoryRequest = (spid) => {
    return Promise.resolve(dummy["stories"].filter(data => (dummy_relation["sprint"]["story"][spid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alluserstories/" + spid + " / ").toPromise()
  }
  getSprintStory = (spid: number = this._currentSprintId): Promise<any> => {
    this.currentSprintId = spid;
    return this.getSprintStoryRequest(spid).then(stories => {
      this.stories = stories as Array<any>;
      return stories
    })
  }
  getStoryRequest = (id) => {
    return Promise.resolve(dummy["stpries"].filter(sprint => sprint.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/userstory/" + id + " / ").toPromise()
  }
  getStory = (id: number = this._currentStoryId): Promise<any> => {
    this.currentStoryId = id;
    return this.getStoryRequest(id).then(story => {
      this.stories.filter(s => s.id == id)[0] = story;
      return story
    })
  }


  getStoryTaskRequest = (stid) => {
    return Promise.resolve(dummy["tasks"].filter(data => (dummy_relation["story"]["task"][stid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alltasks/" + stid + "/").toPromise()
  }
  getSprintTask = (spid: number = this._currentSprintId): Promise<any> => {
    this.currentSprintId = spid;
    return new Promise((res, rej) => {
      this.getSprintStoryRequest(spid).then(stories => {
        this.stories = stories as Array<any>;
        let promises: Promise<any>[] = [];
        for (let story of this.stories) {
          promises.push(this.getStoryTaskRequest(story.id))
        }
        Promise.all(promises).then(taskOfStories => {
          this.tasks = taskOfStories;
          res(taskOfStories)
        })
      })
    })

  }

  getProjectTaskRequest = (pjid) => {
    let tasks = []
    for (let spid of dummy_relation.project.sprint[pjid]) {
      for (let stid of dummy_relation.sprint.story[spid]) {
        for (let tkid of dummy_relation.story.task[stid]) {
          let task = dummy.tasks.filter(task => task.id == tkid)[0]
          task["issues"] = []
          for (let isid of dummy_relation.task.issue[tkid])
            task["issues"].push(dummy.issues.filter(issue => issue.id == isid)[0])
          tasks.push(task)
        }
      }
    }
    return Promise.resolve(tasks)

  }
  getProjectTask = (pjid: number = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectTaskRequest(pjid).then(tasks => {
      this.tasks = tasks as Array<any>;
      return tasks
    })
  }
  get currentProject() {
    try {
      return this.projects.filter(project => project.id == this._currentProjectId)[0]
    }
    catch (err) {
      return null;
    }
  };
  private _currentProjectId = null;
  private get currentProjectId(): number {
    return this._currentProjectId;
  }
  private set currentProjectId(id: number) {
    if (this._currentProjectId != id) {
      this.persons = null;
      this.sprints = null;
      this.stories = null;
      this.tasks = null;

    }
    this._currentProjectId = id;
  }
  get currentSprint() {
    try {
      return this.sprints.filter(sprint => sprint.id == this._currentSprintId)[0]
    }
    catch (err) {
      return null;
    }
  }
  private _currentSprintId = null;
  private get currentSprintId(): number {
    return this._currentSprintId;
  }
  private set currentSprintId(id: number) {
    if (this._currentSprintId != id) {
      this.stories = null;
      this.tasks = null;
    }
    this._currentSprintId = id;
  }
  get currentPerson() {
    try {
      return this.persons.filter(person => person.id == this._currentPersonId)[0]
    }
    catch (err) {
      return null;
    }
  }
  _currentPersonId = null;
  private get currentPersonId(): number {
    return this._currentPersonId;
  }
  private set currentPersonId(id: number) {
    this._currentPersonId = id;
  }
  get currentStory() {
    try {
      return this.stories.filter(story => story.id == this._currentStoryId)[0]
    }
    catch (err) {
      return null;
    }
  }
  private _currentStoryId = null;
  private get currentStoryId(): number {

    return this._currentStoryId;
  }
  private set currentStoryId(id: number) {
    if (this._currentStoryId != id) {
      this.tasks = null;
    }
    this._currentStoryId = id;
  }
  get currentTask() {
    try {
      return this.tasks.filter(story => story.id == this._currentTaskId)[0]
    }
    catch (err) {
      return null;
    }
  }
  private _currentTaskId = null;
  private get currentTaskId(): number {
    return this._currentTaskId;
  }
  private set currentTaskId(id: number) {
    this._currentTaskId = id;
  }
}
