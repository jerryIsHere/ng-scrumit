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
    "issue": {
      1: [1, 2, 3], 2: []
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
      1: [], 2: [], 3: [], 4: [], 7: [], 8: [],
      5: [1, 3],
      6: [2],
    }
  }
}
var dummy = {
  'projects': [
    {
      "creationDate": 1600863833000, "description": "trr", "name": "test project 2", "id": 2, "duration": 0, "cost": 600
    }, {
      "creationDate": 1600662795000, "description": "testing", "name": "test project arrr", "id": 1, "duration": 70, "cost": 600
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
  'tasks': [
    { "creationDate": 1600669342000, "order": 1, "duration": 8, "description": "test-a1", "status": 0, "id": 1, "person": [] },
    { "creationDate": 1600671987000, "order": 2, "duration": 8, "description": "test-b", "status": 0, "id": 2, "person": [] },
    { "creationDate": 1600671141000, "order": 3, "duration": 8, "description": "test  by kenny", "status": 1, "id": 3, "person": [2] },
    { "creationDate": 1600692238000, "order": 4, "duration": 8, "description": "Test", "status": 1, "id": 4, "person": [2] },
    { "creationDate": 1600866624000, "order": 5, "duration": 8, "description": "New task...", "status": 2, "id": 5, "person": [3, 4] },
    { "creationDate": 1600663046000, "order": 6, "duration": 8, "description": "New task...", "status": 3, "id": 6, "person": [3,] },
    { "creationDate": 1600663046000, "order": 7, "duration": 8, "description": "New task...", "status": 4, "id": 7, "person": [2] },
    { "creationDate": 1600663046000, "order": 8, "duration": 8, "description": "New task...", "status": 4, "id": 8, "person": [4] },
  ],
  'issues': [
    { "creationDate": 1600671987000, "hourElapsed": 60, "duration": 0, "cost": 800, "description": "assigne more developer", "category": ["resign", "recruit"], "id": 3 },
    { "creationDate": 1600669342000, "hourElapsed": 60, "duration": 10, "cost": 0, "description": "extend deadline", "category": ["unexpected error"], "id": 2 },
    { "creationDate": 1600671987000, "hourElapsed": 30, "duration": 0, "cost": 400, "description": "assigne more developer", "category": ["resign", "recruit"], "id": 1 },
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
  issues: Array<any> = new Array<any>();
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
  getProject = (pjid): Promise<any> => {
    return this.getProjectRequest(pjid).then(project => {
      this.projects.filter(pj => pj.id == pjid)[0] = project
      return project;
    })
  }


  getProjectPersonRequest = (pjid) => {
    return Promise.resolve(dummy["persons"].filter(data => (dummy_relation["project"]["person"][pjid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/project/allpersons/" + pjid + "/").toPromise()
  }
  getProjectPerson = (pjid: number): Promise<any> => {
    return this.getProjectPersonRequest(pjid).then(persons => {
      this.persons = persons as Array<any>;
      return persons
    })
  }

  getPersonRequest = (id) => {
    return Promise.resolve(dummy["persons"].filter(person => person.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/project/person/" + id + "/").toPromise()
  }
  getPerson = (id: number): Promise<any> => {
    return this.getPersonRequest(id).then(person => {
      this.persons.filter(p => p.id == id)[0] = person;
      return person
    })

  }

  getProjectSprintRequest = (pjid) => {
    return Promise.resolve(dummy["sprints"].filter(data => (dummy_relation["project"]["sprint"][pjid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/all/" + pjid + "/").toPromise()
  }
  getProjectSprint = (pjid: number): Promise<any> => {
    return this.getProjectSprintRequest(pjid).then(sprints => {
      this.sprints = sprints as Array<any>;
      return sprints
    })
  }
  getSprintRequest = (id) => {
    return Promise.resolve(dummy["sprints"].filter(sprint => sprint.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/sprint/" + id + "/").toPromise()
  }
  getSprint = (pjid: number, id): Promise<any> => {
    return this.getSprintRequest(pjid).then(sprint => {
      this.sprints.filter(s => s.id == id)[0] = sprint;
      return sprint
    })
  }


  getSprintStoryRequest = (spid) => {
    return Promise.resolve(dummy["stories"].filter(data => (dummy_relation["sprint"]["story"][spid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alluserstories/" + spid + " / ").toPromise()
  }
  getSprintStory = (spid: number): Promise<any> => {
    return this.getSprintStoryRequest(spid).then(stories => {
      this.stories = stories as Array<any>;
      return stories
    })
  }
  getStoryRequest = (id) => {
    return Promise.resolve(dummy["stpries"].filter(sprint => sprint.id == id))
    return this.http.get("http://34.92.198.0:8080/scrumit/sprint/userstory/" + id + " / ").toPromise()
  }
  getStory = (spid: number, id: number): Promise<any> => {
    return this.getStoryRequest(spid).then(story => {
      this.stories.filter(s => s.id == id)[0] = story;
      return story
    })
  }


  getStoryTaskRequest = (stid) => {
    return Promise.resolve(dummy["tasks"].filter(data => (dummy_relation["story"]["task"][stid] as Array<number>).includes(data.id)))
    return this.http.get("http://34.92.198.0:8080/scrumit/board/alltasks/" + stid + "/").toPromise()
  }
  getSprintTask = (spid: number): Promise<any> => {
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

  getProjectIssueRequest = (pjid) => {
    return Promise.resolve(dummy["issues"].filter(data => (dummy_relation["project"]["issue"][pjid] as Array<number>).includes(data.id)))

  }
  getProjectIssue = (pjid: number): Promise<any> => {
    return this.getProjectIssueRequest(pjid).then(issues => {
      this.issues = issues as Array<any>;
      return issues
    })
  }

}
