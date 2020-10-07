import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list'
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';


import { ChartComponent } from './chart/chart.component';
import { BoardComponent } from './board/board.component';
import { PersonFormComponent } from './person-form/person-form.component';
import { UserstoryFormComponent } from './userstory-form/userstory-form.component';
import { ProjectOverviewComponent } from './project-overview/project-overview.component';

import { FilterPipe } from './filter.pipe';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { SprintOverviewComponent } from './sprint-overview/sprint-overview.component';
import { PersonListComponent } from './person-list/person-list.component';
import { UserStoryListComponent } from './user-story-list/user-story-list.component';
import { HomeComponent } from './home/home.component';
import { SprintHomeComponent } from './sprint-home/sprint-home.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    BoardComponent,
    PersonFormComponent,
    UserstoryFormComponent,
    ProjectOverviewComponent,
    FilterPipe,
    SprintOverviewComponent,
    PersonListComponent,
    UserStoryListComponent,
    HomeComponent,
    SprintHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatBadgeModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    MatButtonToggleModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
