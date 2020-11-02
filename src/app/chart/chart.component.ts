import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(public api: ApiAgentService, public activatedRoute: ActivatedRoute, public router: Router, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.getChart(Number(params.get('id')))
    })
  }



  getChart(pjid) {

    this.api.getProject(pjid).then(project => {
      this.generate_task_issue_line(project, this.api.tasks)
      this.generate_task_issue_bar();
      this.generate_initial_forcast_bar();
      this.generate_issue_sprint_bar(project.id);
      this.generate_burndown_line(project, this.api.tasks)
      this.generate_issue_cat_pie()
    })
  }
  datePipe = new DatePipe('en-US')
  bar_window = 8
  bar_except_weekday = [0, 6]

  bar_chart_update() {
    this.generate_task_issue_bar()
    this.generate_burndown_line(this.api.currentProject, this.api.tasks)
  }
  weekdayToogle(day, b) {
    if (!b) {
      this.bar_except_weekday.push(day)
    }
    else {
      this.bar_except_weekday = this.bar_except_weekday.filter(d => d != day)
    }
    this.bar_chart_update()
  }
  // task or issue with null commencement durration(nullable), not mention in burdown.

  generate_task_issue_line(project, tasks) {
    let line_series = []
    for (let task of tasks) {
      if (task.commencement == null) continue;
      line_series.push({ type: 'line', name: uniqueName(line_series, 'name', task.description, task.id), areaStyle: {}, data: [0], stack: task.id, object: { data: task, type: 'task' } })
      for (let issue of task.issues) {
        if (issue.commencement == null || issue.duration == null || issue.cost == null) continue;
        issue.sprints = task.sprints
        line_series.push({ type: 'line', name: uniqueName(line_series, 'name', issue.description, issue.id), areaStyle: {}, data: [0], stack: task.id, object: { data: issue, type: 'issue' } })
      }
    }
    let xAxis = [0];
    line_series.push({
      type: 'line', name: uniqueName(line_series, 'name', 'cost initial expection'), areaStyle: {}, data: [0], stack: null, object: {
        data: {
          commencement: 0,
          cost: 0,
          duration: project.duration,
          creationDate: project.creationDate,
        },
        type: 'project'
      }
    })
    let i = 1;
    while (true) {
      let haveData = false;
      for (let entry of line_series) {
        if (i < entry.object.data.commencement + entry.object.data.duration) haveData = true;
      }
      if (!haveData) break;
      for (let entry of line_series) {
        if (entry.object.data.commencement <= i && i < entry.object.data.commencement + entry.object.data.duration) {
          let cost = entry.object.data.cost ? entry.object.data.cost : project.cost
          entry.data[i] = entry.data[i - 1] + cost
        }
        else {
          entry.data[i] = entry.data[i - 1];
        }
      }
      xAxis.push(i);
      i++;
    }
    xAxis.push(i);
    let total = { type: 'line', name: uniqueName(line_series, 'name', "total cost forcast"), areaStyle: {}, data: [0], stack: null, object: { type: 'total' } }
    for (let j = 0; j < i; j++) {
      total.data[j] = 0
      for (let entry of line_series.filter(item => item.object.type != 'project')) {
        if (entry.object.data.type != "project dummy")
          total.data[j] += entry.data[j]
      }
    }
    line_series.push(total);
    this.task_issue_line_options.series = line_series;
    this.task_issue_line_options.xAxis["data"] = xAxis;
  }
  generate_task_issue_bar() {
    if (this.task_issue_line_options.series.length < 3) return;
    let issue_bar_series = []
    let xAxis = []
    let date: Date = new Date(
      this.api.currentProject.startDate
    );
    for (let issue of this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'issue')) {
      let data = []
      for (let i = 0; i < issue.data.length; i = i + this.bar_window) {
        data.push(issue.data[i])
      }
      issue_bar_series.push({ type: 'bar', name: issue.name, areaStyle: {}, stack: true, data: data, object: issue.object })
    }
    if (issue_bar_series.length == 0) return;
    while (this.bar_except_weekday.includes(date.getDay())) { date.setDate(date.getDate() + 1) }
    for (let dummy of issue_bar_series[0].data) {
      xAxis.push(this.datePipe.transform(date, 'MMM d EE'))
      do { date.setDate(date.getDate() + 1) }
      while (this.bar_except_weekday.includes(date.getDay()))
    }

    let task_bar_series = []
    for (let task of this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'task')) {
      let data = []
      for (let i = 0; i < task.data.length; i = i + this.bar_window) {
        data.push(task.data[i])
      }
      task_bar_series.push({ type: 'bar', name: task.name, areaStyle: {}, stack: true, data: data, object: task.object })
    }
    let total = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'total')[0]
    let project = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'project')[0]
    let markLine = {
      symbol: 'none',
      label: {
        position: 'middle',
        formatter: '{b} : {c}'
      },
      data: [
        { name: total.name, yAxis: total.data[total.data.length - 1] },
        { name: project.name, yAxis: project.data[project.data.length - 1] },]
    }

    this.issue_bar_options.series = issue_bar_series
    this.issue_bar_options.xAxis["data"] = xAxis;
    this.issue_bar_options.series[0].markLine = markLine;
    this.issue_bar_options.yAxis = { type: 'value', max: total.data[total.data.length - 1] }


    this.task_bar_options.series = task_bar_series
    this.task_bar_options.xAxis["data"] = xAxis;
    this.task_bar_options.series.push({ type: 'bar', markLine: markLine });
    this.task_bar_options.yAxis = { type: 'value', max: total.data[total.data.length - 1] }

    this.issue_bar_options = Object.assign({}, this.issue_bar_options)
    this.task_bar_options = Object.assign({}, this.task_bar_options)
    this.cd.detectChanges();
  }

  generate_initial_forcast_bar() {
    let forcast_bar_series = []
    let initial = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'project')[0]
    let forcast = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'total')[0]
    forcast_bar_series.push({
      type: 'bar', name: initial.name,
      areaStyle: {}, stack: true, data: [initial.data[initial.data.length - 1], 0], object: initial.object
    })
    forcast_bar_series.push({
      type: 'bar', name: forcast.name,
      areaStyle: {}, stack: true, data: [0, forcast.data[forcast.data.length - 1]], object: forcast.object
    })
    this.initial_forcast_bar_options.xAxis["data"] = [initial.name, forcast.name];
    this.initial_forcast_bar_options.series = forcast_bar_series;
  }
  generate_issue_sprint_bar(pjid) {
    this.api.getProjectSprint(pjid).then(sprints => {
      if (this.task_issue_line_options.series.length < 3) return;
      let issue_sprint_bar_series = []
      let xAxis = []
      let sprint_issue_cost: { [spid: number]: { [issue_name: string]: number } } = {}
      for (let issue of this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'issue')) {
        xAxis.push(issue.name)
      }
      for (let sprint of (sprints as Array<any>).sort((a, b) => {
        if (a.endHour == null) return 1;
        if (b.endHour == null) return -1;
        return a.endHour - b.endHour
      })) {
        sprint_issue_cost[sprint.id] = {}
        let issue_series = this.task_issue_line_options.series.filter(item =>
          item.object.type && item.object.type == 'issue' && item.object.data.sprints.includes(sprint.id))
        for (let issue of issue_series) {
          let previous = 0
          for (let s of Object.keys(sprint_issue_cost)) {
            if (sprint_issue_cost[s][issue.name]) previous = previous + sprint_issue_cost[s][issue.name];
          }
          sprint_issue_cost[sprint.id][issue.name] = sprint.endHour ? issue.data[sprint.endHour] :
            issue.data[issue.data.length - 1] - previous;
        }
        issue_sprint_bar_series.push({ type: 'bar', name: sprint.id, areaStyle: {}, data: [], stack: true, })
      }
      for (let issue_name of xAxis) {
        for (let spid in sprint_issue_cost) {
          issue_sprint_bar_series.filter(serie => serie.name == spid)[0].data.push(sprint_issue_cost[spid][issue_name])
        }
      }
      let total = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'total')[0]
      let project = this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'project')[0]
      let markLine = {
        symbol: 'none',
        label: {
          position: 'middle',
          formatter: '{b} : {c}'
        },
        data: [
          { name: total.name, yAxis: total.data[total.data.length - 1] },
          { name: project.name, yAxis: project.data[project.data.length - 1] },]
      }
      issue_sprint_bar_series.sort((a, b) => a.name - b.name)
      this.issue_sprint_bar_options.xAxis["data"] = xAxis;
      this.issue_sprint_bar_options.series = issue_sprint_bar_series;
      this.issue_sprint_bar_options.series[0].markLine = markLine;
      this.issue_sprint_bar_options.yAxis = { type: 'value', max: total.data[total.data.length - 1] }
    })
  }
  // task with null or numerics time data, all in burndown
  // null issue commencement durration(nullable), not mention in burdown.
  generate_burndown_line(project, tasks) {
    let burndown_series = []

    let date: Date = new Date(
      project.startDate
    );
    let task_series = {
      type: 'line', name: 'task actual burndown', areaStyle: {}, data: [
        (tasks as Array<any>).map(task => task.duration).reduce((a, b) => a + b)], stack: true
    }
    let issue_series = {
      type: 'line', name: 'issue actual burndown', areaStyle: {}, data: [0], stack: true, markLine: {}
    }
    let issue_markLine = {
      symbol: 'none',
      label: {
        position: 'middle',
        formatter: '{b}'
      },
      data: []
    }
    issue_series.markLine = issue_markLine
    let ideal_series = { type: 'line', name: 'ideal burndown', areaStyle: {}, data: [] }
    burndown_series.push(task_series)
    burndown_series.push(issue_series)
    burndown_series.push(ideal_series)
    let i = 0;
    while (true) {
      let haveData = false;
      let task_effort_left = task_series.data[task_series.data.length - 1]
      let issue_effort_left = issue_series.data[issue_series.data.length - 1]
      for (let task of tasks) {
        if (task.commencement != null && i < task.commencement + task.duration) {
          haveData = true;
          if (task.commencement <= i && i < task.commencement + task.duration) {
            task_effort_left -= 1
          }

        }
        for (let issue of task.issues) {
          if (issue.commencement != null && i < issue.commencement + issue.duration) {
            haveData = true;
            if (issue.commencement == i) {
              issue_effort_left += issue.duration
              let title = uniqueName(issue_markLine.data, 'name', issue.description, issue.id)
              issue_markLine.data.push({
                tooltip: {
                  formatter: function () {
                    return title
                  }
                },
                name: title,
                xAxis: i
              })
            }
            if (issue.commencement != null && issue.commencement <= i && i < issue.commencement + issue.duration) {
              issue_effort_left -= 1
            }
          }
        }
      }
      task_series.data.push(task_effort_left)
      issue_series.data.push(issue_effort_left)
      if (!haveData) break;
      i++;
    }
    for (let entry of burndown_series) {
      entry.data = entry.data.filter((data, index) => {
        return index % this.bar_window == 0
      })
    }
    let xAxis = []
    while (this.bar_except_weekday.includes(date.getDay())) { date.setDate(date.getDate() + 1) }
    for (let dummy of task_series.data) {
      xAxis.push(this.datePipe.transform(date, 'MMM d EE'))
      ideal_series.data.push(project.duration - this.bar_window * (ideal_series.data.length) > 0 ?
        project.duration - this.bar_window * (ideal_series.data.length) : 0)
      do { date.setDate(date.getDate() + 1) }
      while (this.bar_except_weekday.includes(date.getDay()))
    }

    while (ideal_series.data[ideal_series.data.length - 1] > 0) {
      xAxis.push(this.datePipe.transform(date, 'MMM d EE'))
      ideal_series.data.push(project.duration - this.bar_window * (ideal_series.data.length) > 0 ?
        project.duration - this.bar_window * (ideal_series.data.length) : 0)
      task_series.data.push(task_series.data[task_series.data.length - 1])
      do { date.setDate(date.getDate() + 1) }
      while (this.bar_except_weekday.includes(date.getDay()))
    }

    for (let line of issue_markLine.data) {
      line.xAxis = xAxis[Math.floor(line.xAxis / this.bar_window)]
    }
    let multiple_issue_line_data = []
    for (let line of issue_markLine.data) {
      let line_same_position = issue_markLine.data.filter(data => data.xAxis == line.xAxis)
      if (line_same_position.length > 1 &&
        multiple_issue_line_data.filter(data => data.xAxis == line.xAxis).length == 0) {
        multiple_issue_line_data.push({
          tooltip: {
            formatter: function () {
              return line_same_position.map(l => l.name).join(', ')
            }
          },
          name: 'multiple issue',
          xAxis: line.xAxis
        })
      }
    }
    for (let line of multiple_issue_line_data) {
      issue_markLine.data = issue_markLine.data.filter(d => d.xAxis != line.xAxis)
      issue_markLine.data.push(line)
    }

    this.burndown_line_options.xAxis["data"] = xAxis;
    this.burndown_line_options.series = burndown_series
    this.burndown_line_options = Object.assign({}, this.burndown_line_options)
    this.cd.detectChanges();
  }
  generate_issue_cat_pie() {
    let data = []
    for (let issue_series of this.task_issue_line_options.series.filter(item => item.object.type && item.object.type == 'issue')) {
      for (let cat of issue_series.object.data.category) {
        if (data.filter(data => data.name == cat).length == 0) {
          data.push({ value: issue_series.data[issue_series.data.length - 1], name: cat })
        }
        else {
          data.filter(data => data.name == cat)[0].data += issue_series.data[issue_series.data.length - 1]
        }
      }
    }

    this.issue_cat_pie_options.series[0].data = data
  }
  lineChartInit(event: any) {
    event.getZr().on('click', (e) => {
      let x = event.convertFromPixel({ seriesIndex: 0 }, [e.offsetX, e.offsetY])[0]
      let data = []
      for (let item of this.task_issue_line_options.series.filter(i => i.object.type != 'project' && i.object.type != 'total')) {
        if (item.data[x] > 0)
          data.push({ value: item.data[x], name: item.name })
      }
      this.task_issue_pie_options.series[0].data = data
      this.task_issue_pie_options = Object.assign({}, this.task_issue_pie_options)
      this.cd.detectChanges();

    });
  }


  task_issue_line_options = {

    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: false,

    },
    yAxis: {

    },
    series: [
    ]
  };
  issue_bar_options = {
    title: {
      text: 'Stacked cost of issue'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: true,

    },
    yAxis: {

    },
    series: [
    ]

  }
  task_bar_options = {
    title: {
      text: 'Stacked cost of tasks'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: true,

    },
    yAxis: {

    },
    series: [
    ]
  }
  task_issue_pie_options = {

    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    series: [{
      name: 'cost',
      type: 'pie',
      radius: ['20%', '100%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
    ]
  }
  initial_forcast_bar_options = {

    title: {
      text: 'forcast summary'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: true,

    },
    yAxis: {

    },
    series: [
    ]
  }
  issue_sprint_bar_options = {

    title: {
      text: 'issues cost on sprint'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: true,

    },
    yAxis: {

    },
    series: [
    ]
  }
  burndown_line_options = {
    title: {
      text: 'burndown chart'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 10,
      top: 20,
      bottom: 20,

    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    xAxis: {
      boundaryGap: false,

    },
    yAxis: {

    },
    series: [
    ]
  }
  issue_cat_pie_options = {
    title: {
      text: 'issue category'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    series: [{
      name: 'issues',
      type: 'pie',
      radius: ['20%', '100%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
    ]
  }
}

function uniqueName(series, key, name, uid = null) {
  let i = 0;
  let title = name
  while (series.filter(entry => entry[key] == title).length > 0) {
    if (uid == null) {
      title = name + ' (' + uid + ')';
      break
    }
    i++;
    title = name + ' (' + i + ')';
  }
  return title;
}