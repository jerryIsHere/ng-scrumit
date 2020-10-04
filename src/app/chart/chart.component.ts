import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAgentService } from './../api-agent.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(public api: ApiAgentService, public route: ActivatedRoute) {
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
        let series = []
        for (let task of tasks) {

          series.push({ type: 'line', name: uniqueName(series, 'name', task.description), areaStyle: {}, data: [0], stack: task.id, object: task })
          for (let issue of task.issues) {
            series.push({ type: 'line', name: uniqueName(series, 'name', issue.description), areaStyle: {}, data: [0], stack: task.id, object: issue })
          }
        }
        let xAxis = [0];
        series.push({
          type: 'line', name: uniqueName(series, 'name', project.name), areaStyle: {}, data: [0], stack: null, object: {
            commencement: 0,
            cost: 0,
            duration: project.duration,
            type: 'project dummy'
          }
        })
        let i = 1;
        while (true) {
          let haveData = false;
          for (let entry of series) {
            if (i < entry.object.commencement + entry.object.duration) haveData = true;
            if (entry.object.commencement + entry.object.duration === NaN) console.log(entry.object);
          }
          if (!haveData) break;
          for (let entry of series) {
            if (entry.object.commencement <= i && i < entry.object.commencement + entry.object.duration) {
              let cost = entry.object.cost ? entry.object.cost : project.cost
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
        let total = { type: 'line', name: uniqueName(series, 'name', "total"), areaStyle: {}, data: [0], stack: null, object: { type: 'total dummy' } }
        for (let j = 0; j < i; j++) {
          total.data[j] = 0
          for (let entry of series) {
            if (entry.object.type != "project dummy")
              total.data[j] += entry.data[j]
          }
        }
        series.push(total);
        this.options.series = series;
        this.options.xAxis["data"] = xAxis;
        console.log(series)
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
  options = {

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