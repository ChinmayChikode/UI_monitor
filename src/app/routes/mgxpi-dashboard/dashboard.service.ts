import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
import { Observable } from 'rxjs';
import { urls } from '@env/accessurls';
import { AlertData } from './project-alert/alert-data';
import { ProjectLoadData } from './project-load/project-load-data';
import { LicenseUsagesData } from './license-usages/license-usages-data';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  gettriggerActivityData(projectKey: string, type: string): Observable<any> {
    return this.http.get<any>(urls.SERVER_URL + urls.triggerActivity + projectKey + '/' + type, { headers: this.getHeader() });
  }

  getAlertData(projectKey: string): Observable<AlertData[]> {
    return this.http.get<AlertData[]>(urls.SERVER_URL + urls.alertsByProject + projectKey, { headers: this.getHeader() });
  }

  getProjectLoadData(projectKey: string, type: string): Observable<ProjectLoadData> {
    return this.http.get<ProjectLoadData>(urls.SERVER_URL + urls.projectLoad + projectKey + '/' + type, { headers: this.getHeader() });
  }

  getLicenseDetail(projectKey: string, type: string): Observable<LicenseUsagesData> {
    return this.http.get<LicenseUsagesData>(urls.SERVER_URL + urls.licenseDetails + projectKey + '/' + type, { headers: this.getHeader() });
  }

  getHeader() {
    return new HttpHeaders(
      {
        Authorization: 'Basic ' + btoa('admin:admin')
      }
    );
  }

  triggerActivityDataGraphInit() {
    return {
      series: [
      ],
      chart: {
        type: 'bar',
        height: 178
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      }
      ,
      xaxis: {
        categories: []
      }
    };
  }

  loadGraphTriggerConfig() {
    return {
      
      series: [
        {
          name: 'Total Count',
          data: [5, 7, 3, 9]
        }
      ],
      chart: {
        type: 'bar',
        height: 178
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        type: 'category',
        categories: [
          'Last Hour',
          'Last Day',
          'Since Start-Up'
        ]
      },
      yaxis: {
        title: {
          text: 'Requests Processed'
        }
      },
      fill: {
        type: 'gradient',
        colors: ['#a200ff','#7e0eb5'],
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 100],
          colorStops: []
        }
      },
      tooltip: {
        y: {
          formatter(val) {
            return  val;
          }
        }
      }
    };
  }

  loadProjectLoadGraph() {
    return {
      chart: {
        height: 225,
        type: 'area',
        toolbar: false,
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'straight',
        width: 3,
      },
      series: [],
      xaxis: {
        title: {
          text: 'Time'
        },
        categories: [
        ],
      },
      yaxis: {
        title: {
          text: 'Messages'
        }
      },
      tooltip: {
        x: {
          format: 'hh:mm',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    };
  }
  loadLicenseUsagesGraph() {
    return {
      chart: {
        height: 225,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      colors: ['#0e9e4a', '#ffa21d', '#ff5252'],
      series: [
      ],
      title: {
        text: '',
        align: 'left'
      },
      markers: {
        size: 0,

        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        title: {
          text: 'Time'
        },
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Licenses'
        }
      },
      tooltip: {
        y: [{
          title: {
            formatter: (val) => val + ' '
          }
        }, {
          title: {
            formatter: (val) => val + ' '
          }
        }, {
          title: {
            formatter: (val) => val
          }
        }]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };
  }
}
