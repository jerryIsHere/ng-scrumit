import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ApiAgentService } from './../api-agent.service';
import { CdkDrag, CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StoryAddTaskFormComponent } from '../story-add-task-form/story-add-task-form.component';
import { TaskDeveloperFormComponent } from '../task-developer-form/task-developer-form.component';
import { TaskAddIssueFormComponent } from '../task-add-issue-form/task-add-issue-form.component';
import { TaskEditFormComponent } from '../task-edit-form/task-edit-form.component';
import { IssueEditFormComponent } from '../issue-edit-form/issue-edit-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterPipe } from '../filter.pipe';

enum TASK_STATUS {
  open = 0,
  inprogress = 1,
  fromPrevious = 2,
  moveToNext = 3,
  done = 4,
}
// filter on board about null issue 
// board: hide new issue button on done.
// board: if task have issue undefined/ null, it is not allowed to ge drag to done.
// board: prohibit task from done back to in progress. 

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit {
  color_generator
  color_map: { [index: number]: Array<number> } = {}
  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router,
    public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
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
  filterMap: String = null;
  filterKey = []
  filterValue = []
  toggleFilter(map, key, value) {
    if (key.every(k => this.filterKey.includes(k)) && value.every(v => this.filterValue.includes(v))) {
      this.filterMap = null
      this.filterKey = []
      this.filterValue = []
    }
    else {
      this.filterMap = map;
      this.filterKey = key
      this.filterValue = value
    }
  }
  dragTask(event: CdkDragStart) {
    console.log(this.filterKey.length)
    console.log(this.filterValue.length)
    console.log(this.filterMap)
    if (this.filterKey.length != 0 || this.filterValue.length != 0 || this.filterMap != null) {
      let snackBarRef = this.snackBar.open('Unset filter before you drag and drop!', 'unset', { duration: 5000 });
      snackBarRef.onAction().subscribe(() => {
        this.filterKey = []
        this.filterValue = []
        this.filterMap = null
      })
      document.dispatchEvent(new Event('mouseup'));
    }
  }
  dropTask(event: CdkDragDrop<any>, assignStatus) {
    let task = event.previousContainer.data[event.previousIndex];
    if (assignStatus == TASK_STATUS.open) {
      if (task.status == TASK_STATUS.moveToNext) {
        this.snackBar.open('this task is labeled as move to next sprint,\n unset any special status beofor moving it to "open"!', 'ok',);
        return
      }
    }
    else if (assignStatus == TASK_STATUS.inprogress) {

    }
    else if (assignStatus == TASK_STATUS.done) {
      if (task.status == TASK_STATUS.moveToNext) {
        this.snackBar.open('this task is labeled as move to next sprint,\n unset any special status beofor moving it to "done"!', 'ok',);
        return
      }
      for (let issue of task.issues) {
        if (issue.commencement == null || issue.duration == null || issue.cost == null) {
          this.snackBar.open('there are unresolved issue in this task, resolve all issue befor moving it to "done"!', 'ok', {
            duration: 10000,
          });
          return
        }
      }
      if (task.status != TASK_STATUS.done) {
        let snackBarRef = this.snackBar.open('You can NOT undo this action, are you sure about that?', 'the task is done');
        snackBarRef.onAction().subscribe(() => {
          if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
          } else {
            transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
          }
          this.assignTaskStatus(task, assignStatus)
          this.commitPostTaskList()
        })
        return
      }
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.assignTaskStatus(task, assignStatus)
    this.commitPostTaskList()
  }
  assignTaskStatus(task, status) {
    if (status == TASK_STATUS.inprogress && (task.status == TASK_STATUS.fromPrevious || task.status == TASK_STATUS.moveToNext)) {

    }
    else {
      task.status = status
    }
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
  issueDetailsDialogue(tkid, isid) {
    const dialogRef = this.dialog.open(IssueEditFormComponent, {
      data: { tkid: tkid, id: isid }
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