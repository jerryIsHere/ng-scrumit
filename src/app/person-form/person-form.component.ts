import { Component, OnInit, Input } from '@angular/core';
import { ApiAgentService } from '../api-agent.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  @Input() id:number;
  firstName:string;
  lastName:string;
  email:string;
  @Input() isNew:boolean;
  @Input() pjid:number;

  constructor(public api:ApiAgentService) { }

  ngOnInit(): void {
    if (!this.isNew) {
      console.log('person form ngOnInit'+this.id);
      this.api.getPerson(this.id).then(response => {
        this.clear();
        this.id = response.id;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.email = response.email;
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
    this.firstName = null;
    this.lastName = null;
    this.email = null;
  }

  create():void {
    this.api.createPerson(this.pjid, this.constructRequestObject(true)).then(response =>{
      this.api.getProjectPerson(this.pjid).then(data => {
      })
      this.isNew = false;
    });
  }

  update():void {
    this.api.updatePerson(this.constructRequestObject(false)).then(response => {
      this.ngOnInit();
    });
  }


  constructRequestObject(isNew:boolean):any {
    var projectRequestObject = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    if (!isNew) {
      projectRequestObject['id'] = this.id;
    }
    console.log(projectRequestObject);
    return projectRequestObject;
  }

}