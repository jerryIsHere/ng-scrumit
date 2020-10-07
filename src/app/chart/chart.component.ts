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
          type: 'line', name: uniqueName(line_series, 'name', project.name), areaStyle: {}, data: [0], stack: null, object: {
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
            if (entry.object.data.commencement + entry.object.data.duration === NaN) console.log(entry.object);
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
        let total = { type: 'line', name: uniqueName(line_series, 'name', "total"), areaStyle: {}, data: [0], stack: null, object: { type: 'total' } }
        for (let j = 0; j < i; j++) {
          total.data[j] = 0
          for (let entry of line_series) {
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

    //     return
    //     let overTime = 0
    //     let titleDict: { [description: string]: number } = {};

    //     for (let issue of issues) {
    //       overTime = overTime + issue.duration
    //     }
    //     slope[project.duration + overTime] = 0;
    //     for (let issue of issues) {
    //       let title = issue.description
    //       let i = 0;
    //       while (titleDict.hasOwnProperty(title)) {
    //         i++;
    //         title = issue.description + ' (' + i + ')';
    //       }
    //       titleDict[title] = issue.id;
    //       data.push({
    //         name: title,
    //         series: [
    //           {
    //             name: issue.hourElapsed,
    //             value: 0
    //           },
    //           {
    //             name: project.duration + overTime,
    //             value: (project.duration + overTime) * issue.cost
    //           }
    //         ]
    //       })
    //       if (slope.hasOwnProperty(issue.hourElapsed)) {
    //         slope[issue.hourElapsed] = slope[issue.hourElapsed] + issue.cost
    //       }
    //       else {
    //         slope[issue.hourElapsed] = issue.cost
    //       }
    //     }
    //     let total = {
    //       name: "forcast",
    //       series: []
    //     }

    //     let cummulativeSlope = 0;
    //     let cummulativeCost = 0;
    //     for (let time in slope) {
    //       cummulativeCost = cummulativeSlope * parseInt(time)
    //       cummulativeSlope = cummulativeSlope + slope[time]
    //       total.series.push({ name: parseInt(time), value: cummulativeCost })

    //     }
    //     this.costLineChartTitleId = titleDict;
    //     data.push(total);
    //     this.costLineChart = data;

  }
  datePipe = new DatePipe('en-US')
  generate_bar(window = 8) {
    let bar_series = []
    let xAxis = []
    let date: Date = new Date(
      this.line_options.series.filter(item => item.object.type && item.object.type == 'project')[0].object.data.creationDate
    );
    xAxis.push()
    for (let issue of this.line_options.series.filter(item => item.object.type && item.object.type == 'issue')) {
      let data = []
      for (let i = 0; i < issue.data.length; i = i + window) {
        data.push(issue.data[i])
      }
      bar_series.push({ type: 'bar', name: issue.name, areaStyle: {}, stack: true, data: data, object: issue.object })
    }
    for (let dummy of bar_series[0].data) {
      xAxis.push(this.datePipe.transform(date, 'MMM d'))
      date.setDate(date.getDate() + 1);
    }
    this.bar_options.series = bar_series
    this.bar_options.xAxis["data"] = xAxis;
  }
  line_options = {

    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
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
  bar_options = {

    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
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

  lineChartInit(event: any) {
    event.getZr().on('click', (e) => {
      let x = event.convertFromPixel({ seriesIndex: 0 }, [e.offsetX, e.offsetY])[0]
      let data = []
      for (let item of this.line_options.series.filter(i => i.object.type != 'project' && i.object.type != 'total')) {
        if (item.data[x] > 0)
          data.push({ value: item.data[x], name: item.name })
      }
      console.log(data)
      this.pie_options.series[0].data = data
      this.pie_options = Object.assign({}, this.pie_options)
      this.cd.detectChanges();

    });
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