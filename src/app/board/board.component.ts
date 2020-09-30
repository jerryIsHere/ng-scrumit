import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';
import { TemplateUtilityService } from './../template-utility.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {
  @Input()
  sprintId: number;
  constructor(public api: ApiAgentService, public util: TemplateUtilityService) {

  }
  ngOnInit() {
    this.getSprintTask(this.sprintId);
  }
  storyBoardStyle(story) {

  }
  taskBoardStyle(task) {
    let style = {}
    if (task.status == 3) {
      style["border-color"] = "lightblue"
      style["border-style"] = "solid";
    }
    else if (task.status == 2) {
      style["border-color"] = "pink"
      style["border-style"] = "solid";
    }
    return style;

  }

  dropStory(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task, index) => {
        task.order = index;

      });
    }
    else {
      console.log('dropping story to another container, this is not supposed to happen', 'background: #222; color: #ff0000')
    }
  }
  dropTask(event: CdkDragDrop<any>, status) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    if (status == 1 && (event.container.data[event.currentIndex].status == 2
      || event.container.data[event.currentIndex].status == 3)) {
    }
    else {
      event.container.data[event.currentIndex].status = status
    }
    event.container.data.forEach((task, index) => {
      task.order = index;

    });
    event.previousContainer.data.forEach((task, index) => {
      task.order = index;

    });

  }
  release(event: CdkDragDrop<string[]>, status) {
    if (this.selectedTask == null) return;
    this.api.tasks.reduce((acc, val) => acc.concat(val), []).filter(task => task.id == this.selectedTask)[0].status = status;
  }
  selectedTask
  mouseOverTask(id) {
    this.selectedTask = id
  }

  openDragList = []
  inProgressDragList = []
  doneDragList = []

  getSprintTask(spid: number) {
    this.openDragList = []
    this.inProgressDragList = []
    this.doneDragList = []
    if (!this.api.persons || this.api.persons.length == 0) {
      this.api.getProjectPerson().then(data => {
        this.commitGetTask(spid);
      })
    }
    else {
      this.commitGetTask(spid);
    }


  }
  commitGetTask(spid: number) {
    this.api.getSprintTask(spid).then(data => {

      for (let tasks of data) {
        for (let task of tasks) {
          if (task.status == 0) {
            this.openDragList.push(task)
          }
          else if (task.status == 4) {
            this.doneDragList.push(task)
          }
          else {
            this.inProgressDragList.push(task)
          }
        }
      }
      this.openDragList.sort((a, b) => a.order - b.order)
      this.inProgressDragList.sort((a, b) => a.order - b.order)
      this.doneDragList.sort((a, b) => a.order - b.order)
    })
  }
}
