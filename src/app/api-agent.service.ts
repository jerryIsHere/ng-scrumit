import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { promise } from 'protractor';
const apiURL = (environment as any).apiURL;
var dummy_relation = {
  'project': {
    "person": {
      1: [2, 3, 4], 2: [1] // one to m only???
    },
    "sprint": {
      1: [1, 5], 2: []
    },
  },
  "sprint": {
    "story": {
      1: [1, 2],
      5: []
    },
    "issue": {
      1: [1, 2, 3, 4, 5],
      5: []
    }
  },
  "story": {
    "task": {
      1: [1, 2, 3, 4],
      2: [5, 6, 7, 8, 9]
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
      9: [4, 5]
    }
  }
}
var dummy = {
  'projects': [
    {
      "creationDate": 1600863833000, "startDate": 1600863833000, "description": "trr", "name": "test project 2", "id": 2, "duration": 0, "cost": 400
    }, {
      "creationDate": 1600662795000, "startDate": 1600863833000, "description": "testing", "name": "test project arrr", "id": 1, "duration": 70, "cost": 400
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
    { "slogan": "demo1", "id": 1, "endHour": 50 },
    { "slogan": "demo0", "id": 5, "endHour": null }
  ],
  'stories': [
    {
      "creationDate": null, "xCoord": 10, "yCoord": 6, "duration": 30, "acceptanceTest": null,
      "name": "test", "priority": 1, "id": 1
    },
    {
      "creationDate": null, "xCoord": 10, "yCoord": 27, "duration": 40, "acceptanceTest": null,
      "name": "test2", "priority": 0, "id": 2
    }
  ],
  'tasks': [// task have person & issue array
    { "creationDate": 1600669342000, "commencement": null, "priority": 5, "duration": 8, "description": "test-a1", "status": 0, "id": 1, "persons": [], "issues": [], sprints: [1] },
    { "creationDate": 1600671987000, "commencement": 50, "priority": 2, "duration": 8, "description": "test-b", "status": 0, "id": 2, "persons": [], "issues": [], sprints: [1] },
    { "creationDate": 1600671141000, "commencement": 40, "priority": 3, "duration": 8, "description": "test  by kenny", "status": 1, "id": 3, "persons": [2], "issues": [], sprints: [1] },
    { "creationDate": 1600692238000, "commencement": 40, "priority": 4, "duration": 8, "description": "Test", "status": 1, "id": 4, "persons": [2], "issues": [], sprints: [1] },
    { "creationDate": 1600866624000, "commencement": 30, "priority": 1, "duration": 8, "description": "problem 1", "status": 2, "id": 5, "persons": [3, 4], "issues": [1, 3], sprints: [1, 5] },
    { "creationDate": 1600663046000, "commencement": 62, "priority": 6, "duration": 8, "description": "problem 2", "status": 2, "id": 6, "persons": [3,], "issues": [2], sprints: [1, 5] },
    { "creationDate": 1600663046000, "commencement": 15, "priority": 7, "duration": 8, "description": "New task...", "status": 3, "id": 7, "persons": [2], "issues": [], sprints: [1] },
    { "creationDate": 1600663046000, "commencement": 10, "priority": 8, "duration": 8, "description": "New task...", "status": 4, "id": 8, "persons": [4], "issues": [], sprints: [1] },
    { "creationDate": 1600663046000, "commencement": 60, "priority": 8, "duration": 8, "description": "difficult", "status": 2, "id": 9, "persons": [4], "issues": [4, 5], sprints: [1, 5] },
  ],
  'issues': [
    { "creationDate": 1600671987000, "commencement": 45, "duration": 10, "cost": 300, "description": "assigne more developer", "category": ["resign",], "id": 3 },
    { "creationDate": 1600669342000, "commencement": 70, "duration": 5, "cost": 0, "description": "extend deadline", "category": ["unexpected error"], "id": 2 },
    { "creationDate": 1600671987000, "commencement": 35, "duration": 5, "cost": 800, "description": "assigne more developer", "category": ["recruit"], "id": 1 },
    { "creationDate": 1600671987000, "commencement": null, "duration": 5, "cost": 800, "description": "what to do", "category": ["resign", "recruit"], "id": 4 },
    { "creationDate": 1600671987000, "commencement": null, "duration": 5, "cost": null, "description": "priceless", "category": ["resign", "recruit"], "id": 5 },
  ]

}

@Injectable({
  providedIn: 'root'
})
export class ApiAgentService {
  public testing = true;
  projects: Array<any> = null;
  persons: Array<any> = null;
  sprints: Array<any> = null;
  stories: Array<any> = null;
  tasks: Array<any> = null;
  issues: Array<any> = null;
  constructor(private http: HttpClient,) {
    console.log("(()=>{let x = new XMLHttpRequest();x.open('GET','http://34.92.198.0:8080/scrumit/project/allprojects/'); return x})().send();")
    try {
      (() => { let x = new XMLHttpRequest(); x.open('GET', 'http://34.92.198.0:8080/scrumit/project/allprojects/'); return x })().send();
    }
    catch (e) {
      console.log(e)
    }
  }
  getAllProjectRequest = () => {
    if (this.testing) {
      console.log('getAllProjectRequest/')
      let result = dummy["projects"]
      console.log(result)
      return Promise.resolve(result)
    }
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allprojects/").toPromise()
  }
  getAllProject = (): Promise<any> => {
    return this.getAllProjectRequest().then(projects => {
      this.projects = projects as Array<any>;
      return projects;
    })
  }
  getProjectRequest = (pjid) => {
    if (this.testing) {
      console.log('getProjectRequest/' + pjid)
      let result = dummy["projects"].filter(data => data.id == pjid)[0]
      console.log(result)
      return Promise.resolve(result)
    }
    return this.http.get("http://34.92.198.0:8080/scrumit/project/" + pjid + "/").toPromise()
  }
  getProject = (pjid = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectRequest(pjid).then(project => {
      this.projects.filter(pj => pj.id == pjid)[0] = project
      return project;
    })
  }
  updateProjectRequest = (newProject) => {
    if (this.testing) {
      console.log('updateProjectRequest/')
      console.log(JSON.stringify(newProject))
      return Promise.resolve(true)
    }
    return this.http.post(`${apiURL}/project/update/`, newProject).toPromise();

  }
  updateProject = (newProject): Promise<any> => {
    return this.updateProjectRequest(newProject).then(res => {
      return res;
    });
  }
  createProjectRequest = (newProject) => {
    if (this.testing) {
      console.log('createProjectRequest/')
      console.log(JSON.stringify(newProject))
      return Promise.resolve(true)
    }
    return this.http.post(`${apiURL}/project/add/`, newProject).toPromise();

  }
  createProject = (newProject): Promise<any> => {
    return this.createProjectRequest(newProject).then(res => {
      return res;
    });
  }
  deleteProjectRequest = (pjid) => {
    if (this.testing) {
      console.log('deleteProjectRequest/' + pjid)
      return Promise.resolve(true)
    }
    return this.http.get(`${apiURL}/project/remove/${pjid}/`).toPromise();
  }
  deleteProject = (pjid): Promise<any> => {
    return this.deleteProjectRequest(pjid).then(res => { });
  }


  getProjectPersonRequest = (pjid) => {
    if (this.testing) {
      console.log('getProjectPersonRequest/' + pjid)
      let result = dummy["persons"].filter(data => (dummy_relation["project"]["person"][pjid] as Array<number>).includes(data.id))
      console.log(result)
      return Promise.resolve(result)
    }

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
    if (this.testing) {
      console.log('getPersonRequest/' + id)
      let result = dummy["persons"].filter(person => person.id == id)[0]
      console.log(result)
      return Promise.resolve(result)
    }
    return this.http.get("http://34.92.198.0:8080/scrumit/project/person/" + id + "/").toPromise()
  }
  getPerson = (id: number = this._currentPersonId): Promise<any> => {
    this.currentPersonId = id;
    return this.getPersonRequest(id).then(person => {
      this.persons.filter(p => p.id == id)[0] = person;
      return person
    })
  }
  createPersonRequest = (pjid, newPerson) => {
    if (this.testing) {
      console.log('createPersonRequest/' + pjid)
      console.log(JSON.stringify(newPerson))
      return Promise.resolve(true)
    }
    return this.http.post(`${apiURL}/project/person/add/${pjid}/`, newPerson).toPromise();

  }
  createPerson = (pjid, newPerson): Promise<any> => {
    this.currentProjectId = pjid;
    return this.createPersonRequest(pjid, newPerson).then(response => {
      return response;
    });
  }

  updatePersonRequest = (newPerson) => {
    if (this.testing) {
      console.log('updatePersonRequest/')
      console.log(JSON.stringify(newPerson))
      return Promise.resolve(true);
    }


    return this.http.post(`${apiURL}/project/person/update/`, newPerson).toPromise();
  }
  updatePerson = (newPerson) => {
    return this.updatePersonRequest(newPerson).then(response => {
    });
  }

  deletePersonRequest = (pid) => {
    if (this.testing) {
      console.log('deletePersonRequest/' + pid)
      return Promise.resolve(true);
    }

    return this.http.get(`${apiURL}/project/person/remove/${pid}/`).toPromise();
  }
  deletePerson = (pid): Promise<any> => {
    return this.deletePersonRequest(pid).then(response => {
    })
  }

  getProjectSprintRequest = (pjid) => {
    if (this.testing) {
      console.log('getProjectSprintRequest/' + pjid)
      let result = dummy["sprints"].filter(data => (dummy_relation["project"]["sprint"][pjid] as Array<number>).includes(data.id))
      console.log(result)
      return Promise.resolve(result);
    }
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
    if (this.testing) {
      console.log('getSprintRequest/' + id)
      let result = dummy["sprints"].filter(sprint => sprint.id == id)[0]
      console.log(result)
      return Promise.resolve(result);
    }

    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/sprint/" + id + "/").toPromise()
  }
  getSprint = (id = this._currentSprintId): Promise<any> => {
    this.currentSprintId = id;
    return this.getSprintRequest(id).then(sprint => {
      this.sprints.filter(s => s.id == id)[0] = sprint;
      return sprint
    })
  }


  createSprintRequest = (pjid, newSprint) => {
    if (this.testing) {
      console.log('createSprintRequest/' + pjid)
      console.log(JSON.stringify(newSprint))
      return Promise.resolve(true);
    }

    return this.http.post(`${apiURL}/sprint/add/${pjid}/`, newSprint).toPromise();
  }
  createSprint = (pjid: number, newSprint): Promise<any> => {
    this.currentProjectId = pjid;
    return this.createSprintRequest(pjid, newSprint).then(res => {
      return res;
    });
  }

  updateSprintRequest = (newSprint) => {
    if (this.testing) {
      console.log('updateSprintRequest/')
      console.log(JSON.stringify(newSprint))
      return Promise.resolve(true);
    }

    return this.http.post(`${apiURL}/sprint/update/`, newSprint).toPromise();
  }
  updateSprint = (newSprint): Promise<any> => {
    return this.updateSprintRequest(newSprint).then(res => {
      return res;
    });
  }

  deleteSprintRequest = (sprintId) => {
    if (this.testing) {
      console.log('deletePersonRequest/' + sprintId)
      return Promise.resolve(true)
    }

    return this.http.get(`${apiURL}/sprint/remove/${sprintId}/`).toPromise();
  }
  deleteSprint = (sprintId): Promise<any> => {
    return this.deleteSprintRequest(sprintId);
  }

  getSprintStoryRequest = (spid) => {
    if (this.testing) {
      console.log('getSprintStoryRequest/' + spid)
      let result = dummy["stories"].filter(data => (dummy_relation["sprint"]["story"][spid] as Array<number>).includes(data.id))
      console.log(result)
      return Promise.resolve(result);
    }
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
    if (this.testing) {
      console.log('getStoryRequest/' + id)
      let result = dummy["stories"].filter(sprint => sprint.id == id)[0]
      console.log(result)
      return Promise.resolve(result);
    }
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/userstory/" + id + " / ").toPromise()
  }
  getStory = (id: number = this._currentStoryId): Promise<any> => {
    this.currentStoryId = id;
    return this.getStoryRequest(id).then(story => {
      this.stories.filter(s => s.id == id)[0] = story;
      return story
    })
  }

  createStoryRequest = (spid, newStory) => {
    if (this.testing) {
      console.log('createStoryRequest/' + spid)
      console.log(JSON.stringify(newStory))
      return Promise.resolve(true)
    }

    return this.http.post(`${apiURL}/sprint/add/userstory/${spid}/`, newStory).toPromise();
  }
  createStory = (spid, newStory): Promise<any> => {
    return this.createStoryRequest(spid, newStory).then(response => {
      return response;
    });
  }
  updateStoryRequest = (newStory) => {
    if (this.testing) {
      console.log('updateStoryRequest/')
      console.log(JSON.stringify(newStory))
      return Promise.resolve(true);
    }

    return this.http.post(`${apiURL}/sprint/userstory/update`, newStory).toPromise();
  }
  updateStory = (newStory): Promise<any> => {
    return this.updateStoryRequest(newStory).then(res => {
      return res;
    });
  }
  deleteStoryReqtest = (sid) => {
    if (this.testing) {
      console.log('deleteStoryReqtest/' + sid)
    }
    return this.http.get(`${apiURL}/sprint/userstory/remove/${sid}/`).toPromise();
  }
  deleteStory = (sid): Promise<any> => {
    return this.deleteStoryReqtest(sid).then(response => { });
  }
  getStoryTaskRequest = (stid) => {
    if (this.testing) {
      console.log('getStoryTaskRequest/' + stid)
      let result = dummy["tasks"].filter(data => (dummy_relation["story"]["task"][stid] as Array<number>).includes(data.id))
      console.log(result)
      return Promise.resolve(result)
    }
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alltasks/" + stid + "/").toPromise()
  }
  getTaskIssueRequest = (tkid) => {
    if (this.testing) {
      console.log('getTaskIssueRequest/' + tkid)
      let result = dummy["issues"].filter(data => (dummy_relation["task"]["issue"][tkid] as Array<number>).includes(data.id))
      console.log(result)
      return Promise.resolve(result)
    }
  }
  getSprintTask = (spid: number = this._currentSprintId): Promise<any> => {
    this.currentSprintId = spid;
    return new Promise((res, rej) => {
      this.getSprintStoryRequest(spid).then(stories => {
        this.stories = stories as Array<any>;
        let tasks_promises: Promise<any>[] = [];
        for (let story of this.stories) {
          tasks_promises.push(this.getStoryTaskRequest(story.id).then((data: Array<any>) => {
            story.tasks = data
            return data
          }))
        }
        Promise.all(tasks_promises).then(taskOfStories => {
          let issues_promises: Promise<any>[] = [];
          for (let taskInstory of taskOfStories) {
            for (let task of taskInstory) {
              issues_promises.push(
                this.getTaskIssueRequest(task.id).then(issues => {
                  task.issues = issues
                  return issues
                }))
            }
          }
          Promise.all(issues_promises).then(issuesOfTasks => {
            this.issues = [].concat(...issuesOfTasks)
            this.tasks = [].concat(...taskOfStories)
            res(taskOfStories)
          })

        })
      })
    })

  }

  getProjectTaskRequest = (pjid) => {
    if (this.testing) {
      console.log('getProjectTaskRequest/' + pjid)
      let tasks = []
      for (let spid of dummy_relation.project.sprint[pjid]) {
        for (let stid of dummy_relation.sprint.story[spid]) {
          for (let tkid of dummy_relation.story.task[stid]) {
            let task = Object.assign(dummy.tasks.filter(task => task.id == tkid)[0])
            task["issues"] = []
            for (let isid of dummy_relation.task.issue[tkid])
              task["issues"].push(dummy.issues.filter(issue => issue.id == isid)[0])
            tasks.push(task)
          }
        }
      }
      console.log(tasks)
      return Promise.resolve(tasks)
    }
  }
  getProjectTask = (pjid: number = this._currentProjectId): Promise<any> => {
    this.currentProjectId = pjid;
    return this.getProjectTaskRequest(pjid).then(tasks => {
      this.tasks = tasks as Array<any>;
      return tasks
    })
  }

  postStoryTaskRequest = (stid: number, requestBody: any) => {
    if (this.testing) {
      console.log('postStoryTaskRequest/' + this.currentSprint.id + '/' + stid)
      console.log(JSON.stringify(requestBody))
      let id = 0
      while (dummy.tasks.filter(i => i.id == id).length > 0) id++;
      dummy.tasks.push({
        creationDate: (new Date()).getUTCMilliseconds(), commencement: null, duration: 8, description: requestBody.description,
        id: id, persons: [], issues: [], priority: 0, status: 0, sprints: []
      })
      dummy_relation.story.task[stid].push(id);
      dummy_relation.task.issue[id] = [];
      console.log('not adding dummy relation for issue - project as this demo is for board only')
      return Promise.resolve(true)
    }
  }
  postStoryTask = (stid: number, requestBody: any): Promise<any> => {
    return this.postStoryTaskRequest(stid, requestBody).then(result => {
      return result
    })
  }

  postTaskPersonRequest = (tkid: number, requestBody: any) => {
    if (this.testing) {
      console.log('postTaskPersonRequest/' + tkid)
      console.log(JSON.stringify(requestBody))
      dummy.tasks.filter(task => task.id == tkid)[0].persons = requestBody;
      return Promise.resolve(true)
    }
  }
  postTaskPerson = (tkid: number, requestBody: any): Promise<any> => {
    return this.postTaskPersonRequest(tkid, requestBody).then(result => {
      return result
    })
  }

  postTaskIssueRequest = (tkid: number, requestBody: any) => {
    if (this.testing) {
      console.log('postTaskIssueRequest/' + tkid)
      console.log(JSON.stringify(requestBody))
      let id = 0
      while (dummy.issues.filter(i => i.id == id).length > 0) id++;
      dummy.issues.push({
        creationDate: (new Date()).getUTCMilliseconds(), commencement: null, duration: null, cost: null, description: requestBody.description,
        category: [], id: id,
      })
      dummy_relation.task.issue[tkid].push(id);
      console.log('not adding dummy relation for issue - project as this demo is for board only')
      return Promise.resolve(true)
    }
  }
  postTaskIssue = (tkid: number, requestBody: any): Promise<any> => {
    return this.postTaskIssueRequest(tkid, requestBody).then(result => {
      return result
    })
  }

  patchTaskRequest = (tkid: number, requestBody: any) => {
    if (this.testing) {
      console.log('patchTaskRequest/' + tkid)
      console.log(JSON.stringify(requestBody))
      for (let [key, value] of Object.entries(requestBody)) {
        dummy.tasks.filter(task => task.id == tkid)[0][key] = value
      }
      return Promise.resolve(true)
    }
  }
  patchTask = (tkid: number, requestBody: any): Promise<any> => {
    return this.patchTaskRequest(tkid, requestBody).then(result => {
      return result
    })
  }
  patchIssueRequest = (isid: number, requestBody: any) => {
    if (this.testing) {
      console.log('patchIssueRequest/' + isid)
      console.log(JSON.stringify(requestBody))
      for (let [key, value] of Object.entries(requestBody)) {
        dummy.issues.filter(issue => issue.id == isid)[0][key] = value
      }
      return Promise.resolve(true)
    }
  }
  patchIssue = (isid: number, requestBody: any): Promise<any> => {
    return this.patchIssueRequest(isid, requestBody).then(result => {
      return result
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
  public get currentProjectId(): number {
    return this._currentProjectId;
  }
  public set currentProjectId(id: number) {
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
  public get currentSprintId(): number {
    return this._currentSprintId;
  }
  public set currentSprintId(id: number) {
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
  public get currentPersonId(): number {
    return this._currentPersonId;
  }
  public set currentPersonId(id: number) {
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
  public get currentStoryId(): number {

    return this._currentStoryId;
  }
  public set currentStoryId(id: number) {
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
  public get currentTaskId(): number {
    return this._currentTaskId;
  }
  public set currentTaskId(id: number) {
    this._currentTaskId = id;
  }
}
