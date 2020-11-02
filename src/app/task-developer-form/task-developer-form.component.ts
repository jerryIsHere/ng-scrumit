import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiAgentService } from '../api-agent.service';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-task-developer-form',
  templateUrl: './task-developer-form.component.html',
  styleUrls: ['./task-developer-form.component.css']
})
export class TaskDeveloperFormComponent implements OnInit {

  constructor(public api: ApiAgentService,
    public dialogRef: MatDialogRef<TaskDeveloperFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    console.log(this.api.tasks.filter(
      task => task.id == this.data.id)[0].personId)
    this.api.getProjectPerson(this.api.currentProject.id).then(persons => {
      this.assingedPerson = persons.filter(person => this.api.tasks.filter(
        task => task.id == this.data.id)[0].personId.includes(person.id)).map(person => person.id)
      this.sparedPerson = persons.filter(person => !this.api.tasks.filter(
        task => task.id == this.data.id)[0].personId.includes(person.id)).map(person => person.id)
    })
  }
  removePerson(id) {
    this.assingedPerson = this.assingedPerson.filter(person => person != id)
    this.sparedPerson.push(id)
  }
  assginPerson(id) {
    this.sparedPerson = this.sparedPerson.filter(person => person != id)
    this.assingedPerson.push(id)
  }
  assingedPerson: Array<number> = []
  sparedPerson: Array<number> = []
  submitForm() {
    let task = this.api.tasks.filter(t => t.id == this.data.id)[0]
    task.personId = [1]
    delete task.personName
    this.api.postTaskPerson(task).then(result => {
      if (result) {
        this.dialogRef.close()
      }
    })
  }

}
