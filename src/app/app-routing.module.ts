import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { ChartComponent } from './chart/chart.component'
import { HomeComponent } from './home/home.component';
import { PersonListComponent } from './person-list/person-list.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';
import { SprintHomeComponent } from './sprint-home/sprint-home.component';
import { SprintOverviewComponent } from './sprint-overview/sprint-overview.component';
import { UserStoryListComponent } from './user-story-list/user-story-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'chart/:id', component: ChartComponent },
  { path: 'person-list/:id', component: PersonListComponent },
  { path: 'project-overview/:id', component: ProjectOverviewComponent },
  { path: 'sprint-home/:id', component: SprintHomeComponent },
  { path: 'project/:pjid/userstory-list/:id', component: UserStoryListComponent },
  { path: 'project/:pjid/board/:id', component: BoardComponent },
  { path: 'project/:pjid/sprint-overview/:id', component: SprintOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
