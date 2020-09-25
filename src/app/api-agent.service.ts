import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

var dummy_relation = {
  'project': {
    "person": {
      1: [2], 2: [1]
    },
    "sprint": {
      1: [1]
    },
    "issue": {
      1: [1, 2]
    }
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
      5: [1],
      6: [2],
    }
  }
}
var dummy = {
  'projects': [
    {
      "creationDate": null, "description": null, "name": "test project 2", "id": 2
    }, {
      "creationDate": null, "description": null, "name": "test project arrr", "id": 1
    }
  ],
  'persons': [
    {
      "firstName": "Jerry", "lastName": "Chan", "email": "123@amail.com", "id": 1
    }, {
      "firstName": "Mary", "lastName": "Chan", "email": "456@amail.com", "id": 2
    }
  ],
  'sprints': [
    { "slogan": "demo", "startDate": 1600646400000, "endDate": 1600819200000, "id": 1 }
  ],
  'stories': [
    {
      "creationDate": null, "xCoord": 10, "yCoord": 6, "estimatedSize": 0, "acceptanceTest": null,
      "sprints": [], "tasks": [], "name": "test", "priority": 0, "id": 1
    },
    {
      "creationDate": null, "xCoord": 10, "yCoord": 27, "estimatedSize": 0, "acceptanceTest": null,
      "sprints": [], "tasks": [], "name": "test2", "priority": 0, "id": 2
    }
  ],
  'tasks': [
    { "creationDate": 1600669342000, "order": 1, "duration": 8, "description": "test-a1", "status": 0, "id": 1 },
    { "creationDate": 1600671987000, "order": 2, "duration": 8, "description": "test-b", "status": 0, "id": 2 },
    { "creationDate": 1600671141000, "order": 3, "duration": 8, "description": "test  by kenny", "status": 0, "id": 3 },
    { "creationDate": 1600692238000, "order": 4, "duration": 8, "description": "Test", "status": 1, "id": 4 },
    { "creationDate": 1600866624000, "order": 5, "duration": 8, "description": "New task...", "status": 2, "id": 5 },
    { "creationDate": 1600663046000, "order": 6, "duration": 8, "description": "New task...", "status": 3, "id": 6 },
    { "creationDate": 1600663046000, "order": 7, "duration": 8, "description": "New task...", "status": 4, "id": 7 },
    { "creationDate": 1600663046000, "order": 8, "duration": 8, "description": "New task...", "status": 4, "id": 8 },
  ],
  'issues': [
    { "creationDate": 1600669342000, "duration": 5, "cost": 0, "description": "extend deadline", "category": ["unexpected error"], "id": 1 },
    { "creationDate": 1600671987000, "duration": 0, "cost": 400, "description": "assigne more developer", "category": ["resign", "recruit"], "id": 2 },
  ]

}

@Injectable({
  providedIn: 'root'
})
export class ApiAgentService {
  projects: Array<any> = new Array<any>();
  persons: Array<any> = new Array<any>();
  sprints: Array<any> = new Array<any>();
  stories: Array<any> = new Array<any>();
  tasks: Array<any> = new Array<any>();
  constructor(private http: HttpClient,) {

  }
  getAllProjectRequest = () => {
    return Promise.resolve(dummy["projects"])
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allprojects/").toPromise()
  }
  getAllProject = (): Promise<any> => {
    return this.getAllProjectRequest().then(projects => {

      this.projects = projects as Array<any>;
    })
  }
  getProjectRequest = (pjid) => {
    return Promise.resolve(dummy["projects"].filter(data => data.id == pjid)[0])
    return this.http.get("http://34.92.198.0:8080/scrumit/project/" + pjid + "/").toPromise()
  }
  getProject = (pjid): Promise<any> => {
    return this.getProjectRequest(pjid).then(project => {
      this.projects.filter(pj => pj.id == pjid)[0] = project
    })
  }

  getAllPersonRequest = (pjid) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allpersons/" + pjid + "/").toPromise()
  }
  getAllPerson = (pjid: number): Promise<any> => {
    return this.getAllPersonRequest(pjid).then(persons => {
      this.persons = persons as Array<any>;
    })
  }

  getPersonRequest = (id) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/project/person/" + id + "/").toPromise()
  }
  getPerson = (pjid: number, id: number): Promise<any> => {
    return this.getPersonRequest(id).then(person => {
      this.persons[pjid].filter(p => p.id == id)[0] = person;
    })

  }

  getSprintAllRequest = (pjid) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/all/" + pjid + "/").toPromise()
  }
  getSprintAll = (pjid: number): Promise<any> => {
    return this.getSprintAllRequest(pjid).then(sprints => {
      this.sprints = sprints as Array<any>;
    })
  }
  getSprintRequest = (id) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/sprint/" + id + "/").toPromise()
  }
  getSprint = (pjid: number, id): Promise<any> => {
    return this.getSprintRequest(pjid).then(sprint => {
      this.sprints[pjid].filter(s => s.id == id)[0] = sprint;
    })
  }


  getAllStoryRequest = (spid) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alluserstories/" + spid + " / ").toPromise()
  }
  getAllStory = (spid: number): Promise<any> => {
    return this.getAllStoryRequest(spid).then(stories => {
      this.stories = stories as Array<any>;
    })
  }
  getStoryRequest = (id) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/userstory/" + id + " / ").toPromise()
  }
  getStory = (spid: number, id: number): Promise<any> => {
    return this.getStoryRequest(spid).then(story => {
      this.stories[spid].filter(s => s.id == id)[0] = story;
    })
  }


  getAllTaskRequest = (stid) => {
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alltasks/" + stid + "/").toPromise()
  }
  getAllTask = (spid: number): Promise<any> => {
    return new Promise((res, rej) => {
      this.getAllStoryRequest(spid).then(stories => {
        this.stories[spid] = stories as Array<any>;
        let promises: Promise<any>[] = [];
        for (let story of this.stories[spid]) {
          promises.push(this.getAllTaskRequest(story.id).then(tasks => {
            this.tasks = tasks as Array<any>
            return tasks
          }))
        }
        Promise.all(promises).then(multipleTask => {
          res(multipleTask)
        })
      })
    })

  }


}
