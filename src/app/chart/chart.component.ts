import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(public api: ApiAgentService, public route: ActivatedRoute, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.getChart(Number(params.get('id')))
    })
  }

  costLineChart
  costLineChartTitleId

  getChart(pjid) {
    this.costLineChart = null;

    let slope = {};
    this.api.getProject(pjid).then(project => {
      let data = [{
        name: "initial expectation",
        series: [
          {
            name: 0,
            value: 0,
          },
          {
            name: project.duration,
            value: project.duration * project.cost
          }
        ]
      }]
      slope[0] = project.cost
      this.api.getProjectTask().then(tasks => {
        let line_series = []
        for (let task of tasks) {


          line_series.push({ type: 'line', name: uniqueName(line_series, 'name', task.description), areaStyle: {}, data: [0], stack: task.id, object: { data: task, type: 'task' } })
          for (let issue of task.issues) {
            line_series.push({ type: 'line', name: uniqueName(line_series, 'name', issue.description), areaStyle: {}, data: [0], stack: task.id, object: { data: issue, type: 'issue' } })
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
              entry.data[i] = entry.data[i - 1] + cost  //duration append to end?
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
        this.line_options.series = line_series;
        this.line_options.xAxis["data"] = xAxis;
        //create for summary
        this.generate_bar();
      })
    })
  }
  datePipe = new DatePipe('en-US')
  bar_window = 8
  bar_except_weekday = [0, 6]
  weekdayToogle(day, b) {
    if (!b) {
      this.bar_except_weekday.push(day)
    }
    else {
      this.bar_except_weekday = this.bar_except_weekday.filter(d => d != day)
    }
    this.generate_bar()
  }
  generate_bar() {
    let issue_bar_series = []
    let xAxis = []
    let date: Date = new Date(
      this.line_options.series.filter(item => item.object.type && item.object.type == 'project')[0].object.data.creationDate
    );
    for (let issue of this.line_options.series.filter(item => item.object.type && item.object.type == 'issue')) {
      let data = []
      for (let i = 0; i < issue.data.length; i = i + this.bar_window) {
        data.push(issue.data[i])
      }
      issue_bar_series.push({ type: 'bar', name: issue.name, areaStyle: {}, stack: true, data: data, object: issue.object })
    }

    while (this.bar_except_weekday.includes(date.getDay())) { date.setDate(date.getDate() + 1) }
    for (let dummy of issue_bar_series[0].data) {
      xAxis.push(this.datePipe.transform(date, 'MMM d EE'))
      do { date.setDate(date.getDate() + 1) }
      while (this.bar_except_weekday.includes(date.getDay()))
    }

    let task_bar_series = []
    for (let task of this.line_options.series.filter(item => item.object.type && item.object.type == 'task')) {
      let data = []
      for (let i = 0; i < task.data.length; i = i + this.bar_window) {
        data.push(task.data[i])
      }
      task_bar_series.push({ type: 'bar', name: task.name, areaStyle: {}, stack: true, data: data, object: task.object })
    }
    let total = this.line_options.series.filter(item => item.object.type && item.object.type == 'total')[0]
    let project = this.line_options.series.filter(item => item.object.type && item.object.type == 'project')[0]
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

  lineChartInit(event: any) {
    event.getZr().on('click', (e) => {
      let x = event.convertFromPixel({ seriesIndex: 0 }, [e.offsetX, e.offsetY])[0]
      let data = []
      for (let item of this.line_options.series.filter(i => i.object.type != 'project' && i.object.type != 'total')) {
        if (item.data[x] > 0)
          data.push({ value: item.data[x], name: item.name })
      }
      this.pie_options.series[0].data = data
      this.pie_options = Object.assign({}, this.pie_options)
      this.cd.detectChanges();

    });
  }


  line_options = {

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
  pie_options = {

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
}

function uniqueName(series, key, id) {
  let i = 0;
  let title = id
  while (series.filter(entry => entry[key] == title).length > 0) {
    i++;
    title = id + ' (' + i + ')';
  }
  return title;
}