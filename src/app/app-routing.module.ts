import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { ChartComponent } from './chart/chart.component'
import { HomeComponent } from './home/home.component';
import { PersonListComponent } from './person-list/person-list.component';
import { ProductBacklogListComponent } from './product-backlog-list/product-backlog-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { SprintHomeComponent } from './sprint-home/sprint-home.component';
import { SprintOverviewComponent } from './sprint-overview/sprint-overview.component';
import { UserStoryListComponent } from './user-story-list/user-story-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'person-list', component: PersonListComponent },
  { path: 'product-backlog-list', component: ProductBacklogListComponent },
  { path: 'project-overview', component: ProjectOverviewComponent },
  { path: 'sprint-home', component: SprintHomeComponent },
  { path: 'sprint-backlog', component: UserStoryListComponent },
  { path: 'board', component: BoardComponent },
  { path: 'sprint-overview', component: SprintOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
