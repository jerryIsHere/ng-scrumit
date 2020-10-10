import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';


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

//TODO cannot fix CORS problem
let httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json'
  })
};

const apiURL = environment.apiURL;

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
    return this.http.get(`${apiURL}/project/allprojects/`).toPromise();
  }
  getAllProject = (): Promise<any> => {
    return this.getAllProjectRequest().then(projects => {
      this.projects = projects as Array<any>;
      return projects;
    })
  }
  getProjectRequest = (pjid) => {
    return this.http.get(`${apiURL}/project/${pjid}/`).toPromise();
  }
  getProject = (pjid = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectRequest(pjid).then(project => {
      this.projects.map((existingProj,index) => {
        if (existingProj.id == pjid) {
          project['creationDate'] = this.convertToDateTime(parseInt(project['creationDate']));
          this.projects[index] = project;
        }
      });
      return project;
    })
  }
  updateProjectRequest = (newProject) => {
    return this.http.post(`${apiURL}/project/update/`,newProject).toPromise();
  }
  updateProject = (newProject): Promise<any> => {
    return this.updateProjectRequest(newProject).then(res => {
      return res;
    });
  }
  createProjectRequest = (newProject) => {
    return this.http.post(`${apiURL}/project/add/`,newProject).toPromise();
  }
  createProject = (newProject):Promise<any> => {
    return this.createProjectRequest(newProject).then(res => {
      return res;
    });
  }
  deleteProjectRequest = (pjid) => {
    return this.http.get(`${apiURL}/project/remove/${pjid}/`).toPromise();
  }
  deleteProject = (pjid):Promise<any> => {
    return this.deleteProjectRequest(pjid).then(res => {});
  }

  getProjectPersonRequest = (pjid) => {
    return this.http.get(`${apiURL}/project/allpersons/${pjid}/`).toPromise();
  }
  getProjectPerson = (pjid: number = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectPersonRequest(pjid).then(persons => {
      this.persons = persons as Array<any>;
      return persons
    })
  }

  getPersonRequest = (id) => {
    return this.http.get(`${apiURL}/project/person/${id}/`).toPromise();
  }
  getPerson = (id: number = this._currentPersonId): Promise<any> => {
    this.currentPersonId = id;
    return this.getPersonRequest(id).then(person => {
      this.persons.filter(p => p.id == id)[0] = person;
      return person;
    })
  }
  createPersonRequest = (pjid,newPerson) => {
    return this.http.post(`${apiURL}/project/person/add/${pjid}/`,newPerson).toPromise();
  }
  createPerson = (pjid,newPerson): Promise<any> => {
    this.currentProjectId = pjid;
    return this.createPersonRequest(pjid,newPerson).then(response => {
      return response;
    });
  }

  updatePersonRequest = (newPerson) => {
    return this.http.post(`${apiURL}/project/person/update/`,newPerson).toPromise();
  }
  updatePerson = (newPerson) => {
    return this.updatePersonRequest(newPerson).then(response => {
    });
  }

  deletePersonRequest = (pid) => {
    return this.http.get(`${apiURL}/project/person/remove/${pid}/`).toPromise();
  }
  deletePerson = (pid): Promise<any> => {
    return this.deletePersonRequest(pid).then(response => {
    })
  }

  getProjectSprintRequest = (pjid) => {
    return this.http.get(`${apiURL}/sprint/all/${pjid}/`).toPromise();
  }
  getProjectSprint = (pjid): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectSprintRequest(pjid).then(sprints => {
      this.sprints = sprints as Array<any>;
      return sprints;
    })
  }
  getSprintRequest = (id) => {
    return this.http.get(`${apiURL}/sprint/sprint/${id}/`).toPromise();
  }
  getSprint = (pjid: number , id): Promise<any> => {
    this.currentProjectId = pjid;
    this.currentSprintId = id;
    return this.getSprintRequest(id).then(sprint => {
      this.sprints.map((existingSprint,index) => {
        if (existingSprint.id == id) {
          sprint['startDate'] = this.convertToDate(parseInt(sprint['startDate']));
          sprint['endDate'] = this.convertToDate(parseInt(sprint['endDate']));
          this.sprints[index] = sprint;
        }
      });
      return sprint;
    });
  }

  createSprintRequest = (pjid,newSprint) => {
      return this.http.post(`${apiURL}/sprint/add/${pjid}/`,newSprint).toPromise();
  }
  createSprint = (pjid: number,newSprint):Promise<any> => {
      this.currentProjectId = pjid;
      return this.createSprintRequest(pjid,newSprint).then(res=>{
        return res;
      });
  }

  updateSprintRequest = (newSprint) => {
    return this.http.post(`${apiURL}/sprint/update/`,newSprint).toPromise();
  }
  updateSprint = (newSprint):Promise<any> => {
    return this.updateSprintRequest(newSprint).then(res => {
      return res;
    });
  }

  deleteSprintRequest = (sprintId) => {
    return this.http.get(`${apiURL}/sprint/remove/${sprintId}/`).toPromise();
  }
  deleteSprint = (sprintId): Promise<any> => {
    return this.deleteSprintRequest(sprintId);
  }

  getSprintStoryRequest = (spid) => {
    return this.http.get(`${apiURL}/board/alluserstories/${spid}/`).toPromise();
  }
  getSprintStory = (spid: number = this._currentSprintId): Promise<any> => {
    this.currentSprintId = spid;
    return this.getSprintStoryRequest(spid).then(stories => {
      this.stories = stories as Array<any>;
      return stories
    })
  }
  getStoryRequest = (id) => {
    return this.http.get(`${apiURL}/sprint/userstory/${id}/`).toPromise();
  }
  getStory = (id: number = this._currentStoryId): Promise<any> => {
    this.currentStoryId = id;
    return this.getSprintRequest(id).then(story => {
      this.stories.map((existingStory,index) => {
        if (existingStory.id == id) {
          story['creationDate'] = this.convertToDate(parseInt(story['startDate']));
          this.stories[index] = story;
        }
      });
      return story;
    });
  }
  createStoryRequest = (spid,newStory) => {
    return this.http.post(`${apiURL}/sprint/add/userstory/${spid}/`,newStory).toPromise();
  }
  createStory = (spid,newStory): Promise<any> => {
    return this.createStoryRequest(spid,newStory).then(response => {
      return response;
    });
  }
  updateStoryRequest = (newStory) => {
    return this.http.post(`${apiURL}/sprint/userstory/update`,newStory).toPromise();
  }
  updateStory = (newStory): Promise<any> => {
    return this.updateStoryRequest(newStory).then(res => {
      return res;
    });
  }
  deleteStoryReqyest = (sid) => {
    return this.http.get(`${apiURL}/sprint/userstory/remove/${sid}/`).toPromise();
  }
  deleteStory = (sid): Promise<any> => {
    return this.deleteStoryReqyest(sid).then(response => {});
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

  convertToDateTime = (milliseconds: number): string => {
    const dataObject = new Date(milliseconds);
    var day = `${dataObject.getDate()}`;
    var month = `${(dataObject.getMonth() + 1)}`;
    var year = `${dataObject.getFullYear()}`;
    var hour = `${dataObject.getHours()}`
    var minutes = `${dataObject.getMinutes()}`
    var seconds = `${dataObject.getSeconds()}`
    var dateTime =  `${day}.${month}.${year} ${hour}:${minutes}:${seconds}`;
    return dateTime;
  }

  convertToDate = (milliseconds: number): string => {
    const dataObject = new Date(milliseconds);
    var day = `${dataObject.getDate()}`;
    var month = `${(dataObject.getMonth() + 1)}`;
    var year = `${dataObject.getFullYear()}`;
    var dateTime =  `${day}.${month}.${year}`;
    return dateTime;
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
  get currentProjectId(): number {
    return this._currentProjectId;
  }
  set currentProjectId(id: number) {
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
  get currentSprintId(): number {
    return this._currentSprintId;
  }
  set currentSprintId(id: number) {
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
