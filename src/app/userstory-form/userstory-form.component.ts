import { Component, Input, OnInit } from '@angular/core';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-userstory-form',
  templateUrl: './userstory-form.component.html',
  styleUrls: ['./userstory-form.component.css']
})
export class UserstoryFormComponent implements OnInit {

  @Input() id:number;
  name:string;
  priority:number;
  estimatedSize:number;
  acceptanceTest:number;
  creationDate:string;
  @Input() isNew:boolean;
  @Input() spid:number;

  constructor(public api:ApiAgentService) { }

  ngOnInit(): void {
    if (!this.isNew) {
      console.log('person form ngOnInit'+this.id);
      this.api.getStory(this.id).then(response => {
        this.clear();
        this.id = response.id;
        this.name = response.name;
        this.priority = response.priority;
        this.estimatedSize = response.estimatedSize;
        this.acceptanceTest = response.acceptanceTest;
        this.creationDate = response.creationDate;
      })
    } else {
      this.clear();
    }
  }

  reset():void {
    this.ngOnInit();
  }

  clear():void {
    this.id = null;
    this.name = null;
    this.priority = null;
    this.estimatedSize = null;
    this.acceptanceTest = null;
    this.creationDate = null;
  }

  create():void {
    this.api.createStory(this.spid, this.constructRequestObject(true)).then(response =>{
      this.api.getSprintStory(this.spid).then(data => {
      })
      this.isNew = false;
    });
  }

  update():void {
    this.api.updateStory(this.constructRequestObject(false)).then(response => {
      this.ngOnInit();
    });
  }

  constructRequestObject(isNew:boolean):any {
    var storyRequestObject = {
      name:this.name,
      priority: this.priority,
      estimatedSize: this.estimatedSize,
      acceptanceTest: this.acceptanceTest
    };
    if (!isNew) {
      storyRequestObject['id'] = this.id;
      storyRequestObject['creationDate'] = this.creationDate;
    }
    console.log(storyRequestObject);
    return storyRequestObject;
  }

}
