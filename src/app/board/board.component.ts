import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StoryAddTaskFormComponent } from '../story-add-task-form/story-add-task-form.component';
import { TaskDeveloperFormComponent } from '../task-developer-form/task-developer-form.component';
import { TaskAddIssueFormComponent } from '../task-add-issue-form/task-add-issue-form.component';
import { TaskEditFormComponent } from '../task-edit-form/task-edit-form.component';
import { IssueEditFormComponent } from '../issue-edit-form/issue-edit-form.component';

enum TASK_STATUS {
  open = 0,
  inprogress = 1,
  fromPrevious = 2,
  moveToNext = 3,
  done = 4,
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {
  color_generator
  color_map: { [index: number]: Array<number> } = {}
  constructor(public api: ApiAgentService, public route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getSprintTask(params.get('pjid'), params.get('id'));
    })
  }

  storyBoardStyle(story) {
    let style = {}
    style['background-color'] =
      'rgb(' + this.color_map[story.id][0] + ',' + this.color_map[story.id][1] + ',' + this.color_map[story.id][2] + ')'
    return style
  }
  taskBoardStyle(task) {
    let style = {}
    if (task.status == TASK_STATUS.moveToNext) {
      style["border-color"] = "gold"
      style["border-style"] = "solid";
    }
    else if (task.status == TASK_STATUS.fromPrevious || task.sprints.length > 1) {
      style["border-color"] = "lightcoral"
      style["border-style"] = "solid";
    }
    let storyid = this.api.stories.filter(story => {
      for (let t of story.tasks) {
        if (t.id == task.id) return true;
      }
      return false;
    })[0].id
    style['background-color'] =
      'rgb(' + this.color_map[storyid][0] + ',' + this.color_map[storyid][1] + ',' + this.color_map[storyid][2] + ')'

    return style;

  }

  dropStory(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task, index) => {
        task.priority = index;
      });
    }

  }
  dragListStatusExcludePredicate(not: Array<number>) {
    return (drag: CdkDrag) => {
      return !not.includes(drag.data.status)
    }
  }
  dropTask(event: CdkDragDrop<any>, assignStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    if (assignStatus == TASK_STATUS.inprogress && (event.container.data[event.currentIndex].status == TASK_STATUS.fromPrevious
      || event.container.data[event.currentIndex].status == TASK_STATUS.moveToNext)) {
    }
    // else if (assignStatus == TASK_STATUS.done && event.container.data[event.currentIndex].status == TASK_STATUS.fromPrevious) {

    // }
    else {
      event.container.data[event.currentIndex].status = assignStatus
    }
    this.commitPostTaskList()
  }
  commitPostTaskList() {
    let postBody = []
    for (let list of [this.openDragList, this.inProgressDragList, this.doneDragList]) {
      let index = list.length
      for (let task of list) {
        task.priority = index;
        postBody.push(task)
        index--;
      }
    }
  }
  release(event: CdkDragDrop<string[]>, assignStatus) {
    if (this.selectedTaskId == null) return;
    let selectedTask = this.api.tasks.filter(task => task.id == this.selectedTaskId)[0]
    if ((assignStatus == TASK_STATUS.inprogress && selectedTask.status != TASK_STATUS.fromPrevious) ||
      (assignStatus == TASK_STATUS.moveToNext && selectedTask.status != TASK_STATUS.fromPrevious)) {
      selectedTask.status = assignStatus;
      this.commitPostTaskList()
    }
  }
  selectedTaskId

  openDragList = []
  inProgressDragList = []
  doneDragList = []
  getSprintTask(pjid, spid) {
    this.api.getProjectPerson(pjid).then(data => {
      this.color_generator = matplotlib_set3_color()
      this.openDragList = []
      this.inProgressDragList = []
      this.doneDragList = []
      this.commitGetTask(spid);
    })
  }

  commitGetTask(spid) {
    this.api.getSprintTask(spid).then(data => {
      for (let tasks of data) {
        for (let task of tasks) {
          if (task.status == TASK_STATUS.open) {
            this.openDragList.push(task)
          }
          else if (task.status == TASK_STATUS.done) {
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

      for (let story of this.api.stories) {
        this.color_map[story.id] = (this.color_generator.next().value as Array<number>)
      }

    })
  }
  createTaskDialogue(stid) {
    const dialogRef = this.dialog.open(StoryAddTaskFormComponent, {
      data: { id: stid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSprintTask(this.api.currentProject.id, this.api.currentSprint.id)
    });
  }
  assignPersonDialogue(tkid) {
    const dialogRef = this.dialog.open(TaskDeveloperFormComponent, {
      data: { id: tkid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSprintTask(this.api.currentProject.id, this.api.currentSprint.id)
    });
  }
  createIssueDialogue(tkid) {
    const dialogRef = this.dialog.open(TaskAddIssueFormComponent, {
      data: { id: tkid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSprintTask(this.api.currentProject.id, this.api.currentSprint.id)
    });
  }
  taskDetailsDialogue(tkid) {
    const dialogRef = this.dialog.open(TaskEditFormComponent, {
      data: { id: tkid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSprintTask(this.api.currentProject.id, this.api.currentSprint.id)
    });
  }
  issueDetailsDialogue(tkid) {
    const dialogRef = this.dialog.open(IssueEditFormComponent, {
      data: { id: tkid }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSprintTask(this.api.currentProject.id, this.api.currentSprint.id)
    });
  }
}

function* matplotlib_set3_color(): IterableIterator<Array<number>> {
  let offset = [0, 0, 0];
  let i = 0
  let Set3 = [[0.000, [0.553, 0.827, 0.780]],
  [0.091, [1.000, 1.000, 0.702]],
  [0.182, [0.745, 0.729, 0.855]],
  [0.273, [0.984, 0.502, 0.447]], [0.364, [0.502, 0.694, 0.827]],
  [0.455, [0.992, 0.706, 0.384]], [0.545, [0.702, 0.871, 0.412]],
  [0.636, [0.988, 0.804, 0.898]], [0.727, [0.851, 0.851, 0.851]],
  [0.818, [0.737, 0.502, 0.741]], [0.909, [0.800, 0.922, 0.773]],
  [1.000, [1.000, 0.929, 0.435]]];
  while (true) {
    let color = [255 * Math.min(Set3[i][1][0] + offset[0], 1), 255 * Math.min(Set3[i][1][1] + offset[1], 1), 255 * Math.min(Set3[i][1][2] + offset[2], 1)]
    color = [Math.round(color[0]), Math.round(color[1]), Math.round(color[2])]
    yield color
    i++;
    if (i > Set3.length - 1) {
      offset = [offset[0] - 0.2, offset[1] - 0.2, offset[2] - 0.2]
      i = 0
    }
  }
}