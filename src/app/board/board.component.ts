import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {

  constructor(public api: ApiAgentService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getSprintTask(params.get('id'));

    })
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
        task.priority = index;
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
      task.priority = index;

    });
    event.previousContainer.data.forEach((task, index) => {
      task.priority = index;

    });

  }
  release(event: CdkDragDrop<string[]>, status) {
    if (this.selectedTask == null) return;
    this.api.tasks.reduce((acc, val) => acc.concat(val), []).filter(task => task.id == this.selectedTask)[0].status = status;
  }
  selectedTask

  openDragList = []
  inProgressDragList = []
  doneDragList = []
  taskList = [this.openDragList, this.inProgressDragList, this.doneDragList]
  getSprintTask(spid) {
    this.api.getSprintTask(spid).then(data => {
      this.openDragList = []
      this.inProgressDragList = []
      this.doneDragList = []
      if (!this.api.persons || this.api.persons.length == 0) {
        this.api.getProjectPerson().then(data => {
          this.commitGetTask();
        })
      }
      else {
        this.commitGetTask();
      }
    })



  }
  commitGetTask() {
    this.api.getSprintTask().then(data => {
      console.log(data)
      console.log(this.api.stories)
      console.log(this.api.tasks)
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
      this.openDragList.sort((a, b) => b.priority - a.priority)
      this.inProgressDragList.sort((a, b) => b.priority - a.priority)
      this.doneDragList.sort((a, b) => b.priority - a.priority)
      this.api.stories.sort((a, b) => b.priority - a.priority)
    })
  }
}
